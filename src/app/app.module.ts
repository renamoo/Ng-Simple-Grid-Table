
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSimpleGridTableModule } from './../../projects/ng-simple-grid-table/src/lib/ng-simple-grid-table.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgSimpleGridTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
