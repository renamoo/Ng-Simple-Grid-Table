import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgsGridTable } from './grid-table.component';


@NgModule({
  declarations: [NgsGridTable],
  imports: [
    CommonModule
  ],
  exports: [NgsGridTable]
})
export class NgSimpleGridTableModule { }
