import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatInputModule,
  MatCheckboxModule
} from '@angular/material';
import { BocLoginComponent } from './components/boc-login/boc-login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AvailableBalanceComponent } from './components/available-balance/available-balance.component';
import { PayComponent } from './components/pay/pay.component';
import { ImageSubsetComponent } from './components/image-subset/image-subset.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExportComponent } from './components/export/export.component';

@NgModule({
  declarations: [
    AppComponent,
    BocLoginComponent,
    AvailableBalanceComponent,
    PayComponent,
    ImageSubsetComponent,
    InvoiceListComponent,
    ExportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
