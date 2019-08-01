import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { bufferTime, distinctUntilChanged, filter, first, takeUntil } from 'rxjs/operators';

export interface NgsGridTableColumn {
  id: string;
  label: string;
}

// Type declarations for Clipboard API
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
interface Clipboard {
  writeText(newClipText: string): Promise<void>;
  // Add any other methods you need here.
}

interface NavigatorClipboard {
  // Only available in a secure context.
  readonly clipboard?: Clipboard;
}

const isMoreThanOneRow = (prev: number, next: number): boolean => {
  const diff = Math.abs(prev - next);
  return diff >= 20;
};

const isMoreThanOneCol = (prev: number, next: number, prevWidth: number): boolean => {
  const diff = Math.abs(prev - next);
  return diff >= prevWidth * 0.7;
};

@Component({
  selector: 'ngs-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss']
})
export class NgsGridTable implements OnInit, OnDestroy {
  @ViewChildren('cells') cells: QueryList<any>;
  @ViewChild('cover', { static: true }) cover: ElementRef;
  @ViewChild('outline', { static: true }) outline: ElementRef;
  @ViewChild('pointer', { static: false }) pointer: ElementRef;
  @Input() columns: NgsGridTableColumn[];
  @Input() values: { [column: string]: unknown }[];
  focused: { index: number, colId?: string };
  selectedCells = [];
  range: { colIds: string[], startInd: number, endInd: number } = null;
  destroy$: Subscription = new Subscription();
  removeEventListener: () => void;

  constructor(private zone: NgZone, private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.removeEventListener = this.renderer.listen(
        'document',
        'mousedown',
        (e: MouseEvent) => {
          if (e.target['className'] !== 'ngs-right-bottom') {
            this.zone.run(() => {
              this.range = null;
            });
          }
          if (!this.elementRef.nativeElement.contains(e.target)) {
            this.zone.run(() => {
              this.focused = null;
            });
          }
        }
      );
      this.destroy$.add(fromEvent(document, 'keydown').pipe(
        bufferTime(1000),
        filter((arr: KeyboardEvent[]) => !!arr && arr.length > 1 && !!arr.find((e: KeyboardEvent) => e.key === 'Control') && !!arr.find((e: KeyboardEvent) => e.key === 'c'))
      ).subscribe(() => {
        if (this.range) {
          let str = ``;
          for (let i = this.range.startInd; i < this.range.endInd + 1; i++) {
            this.range.colIds.forEach((colId, colInd) => {
              str += `${this.getCellText(colId, i)}`;
              if (colInd !== this.range.colIds.length - 1) { str += '\t'; }
            });
            str += `\n`;
          }
          (navigator as NavigatorClipboard).clipboard.writeText(str);
        }
      }));
    });
  }

  onFocus(i: number, colId?: string) {
    this.focused = { index: i, colId: colId };
  }

  onDrag(colId?: string, i?: number) {
    if (!this.range) { this.range = { colIds: [colId], startInd: i, endInd: i }; }
    this.zone.runOutsideAngular(() => {
      fromEvent(document, 'mousemove').pipe(
        distinctUntilChanged((prev: MouseEvent, next: MouseEvent) => {
          const prevCell = this.cells.find(item => item.nativeElement.id === `ngs-${this.range.colIds[this.range.colIds.length - 1]}-${this.range.endInd}`).nativeElement;
          return !(isMoreThanOneCol(prevCell.offsetLeft + prevCell.offsetWidth, next.x, prevCell.offsetWidth) || isMoreThanOneRow(prevCell.offsetTop + 26, next.y));
        }),
        takeUntil(fromEvent(document, 'mouseup').pipe(first()))
      ).subscribe((event: MouseEvent) => {
        this.zone.run(() => {
          const originCell = this.cells.find(item => item.nativeElement.id === `ngs-${this.range.colIds[0]}-${this.range.startInd}`);
          const prevCell = this.cells.find(item => item.nativeElement.id === `ngs-${this.range.colIds[this.range.colIds.length - 1]}-${this.range.endInd}`);
          const prevCellEl = prevCell.nativeElement;

          if (isMoreThanOneRow(prevCellEl.offsetTop + 26, event.y)) {
            this.range.endInd++;
          }

          if (isMoreThanOneCol(prevCellEl.offsetLeft + prevCellEl.offsetWidth, event.x, prevCellEl.offsetWidth)) {
            const rightestColId: string = this.range.colIds[this.range.colIds.length - 1];
            const prevColId = this.columns[this.columns.findIndex(col => col.id === rightestColId) + 1].id;
            this.range.colIds.push(prevColId);
          }

          const lestCell = this.cells.find(item => item.nativeElement.id === `ngs-${this.range.colIds[this.range.colIds.length - 1]}-${this.range.endInd}`);

          this.applySelectedCSS(this.cover, originCell, lestCell);
          this.applySelectedCSS(this.outline, originCell, lestCell);
        });
      });
    });
  }

  applySelectedCSS(target: ElementRef, originCell: ElementRef, lastCell: ElementRef) {
    const native = target.nativeElement;
    const origin = originCell.nativeElement;
    const last = lastCell.nativeElement;
    this.renderer.setStyle(native, 'top', `${origin.offsetTop}px`);
    this.renderer.setStyle(native, 'left', `${origin.offsetLeft}px`);
    this.renderer.setStyle(native, 'width', `${last.offsetLeft - origin.offsetLeft + last.offsetWidth}px`);
    this.renderer.setStyle(native, 'height', `${this.range.endInd !== this.range.startInd ? (this.range.endInd - this.range.startInd) * 26 : 26}px`);
  }

  getCellText(colId: string, i: number): string {
    const target = this.cells.find(item => item.nativeElement.id === `ngs-${colId}-${i}`);
    return target.nativeElement.textContent.trim();
  }

  ngOnDestroy() {
    this.removeEventListener();
    this.destroy$.unsubscribe();
  }

}
