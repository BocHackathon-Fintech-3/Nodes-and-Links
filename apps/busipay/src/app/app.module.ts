import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { BocLoginComponent } from './components/boc-login/boc-login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AvailableBalanceComponent } from './components/available-balance/available-balance.component';
import { PayComponent } from './components/pay/pay.component';

@NgModule({
  declarations: [AppComponent, BocLoginComponent, AvailableBalanceComponent, PayComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
