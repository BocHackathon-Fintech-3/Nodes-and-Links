import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule, MatButtonModule} from '@angular/material';
import { BocLoginComponent } from './components/boc-login/boc-login.component';


@NgModule({
  declarations: [AppComponent, BocLoginComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatToolbarModule, MatButtonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
