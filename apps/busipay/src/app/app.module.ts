import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { BocLoginComponent } from './components/boc-login/boc-login.component';
import { DndComponent } from './components/dnd/dnd.component';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [AppComponent, BocLoginComponent, DndComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    NgxFileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
