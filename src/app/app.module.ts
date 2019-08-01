import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSimpleGridTableModule } from 'ng-simple-grid-table';
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
