import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatListModule
} from '@angular/material';
import { BocLoginComponent } from './components/boc-login/boc-login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AvailableBalanceComponent } from './components/available-balance/available-balance.component';
import { PayComponent } from './components/pay/pay.component';
import { ImageSubsetComponent } from './components/image-subset/image-subset.component';

@NgModule({
  declarations: [
    AppComponent,
    BocLoginComponent,
    AvailableBalanceComponent,
    PayComponent,
    ImageSubsetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule,
    RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
