import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgsGridTable } from './grid-table.component';


@NgModule({
  declarations: [NgsGridTable],
  imports: [
    BrowserModule,
  ],
  exports: [NgsGridTable]
})
export class NgSimpleGridTableModule { }
