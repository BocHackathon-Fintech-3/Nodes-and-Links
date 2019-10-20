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
  MatCheckboxModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatIconModule
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
import { DndComponent } from './components/dnd/dnd.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { EmptyComponent } from './components/empty/empty.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MyInvoicesComponent } from './components/my-invoices/my-invoices.component';
import { ZipInvoicesDownloadComponent } from './components/zip-invoices-download/zip-invoices-download.component';

@NgModule({
  declarations: [
    AppComponent,
    BocLoginComponent,
    AvailableBalanceComponent,
    PayComponent,
    ImageSubsetComponent,
    InvoiceListComponent,
    ExportComponent,
    DndComponent,
    EmptyComponent,
    MyInvoicesComponent,
    ZipInvoicesDownloadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule.forRoot(APP_ROUTES, { onSameUrlNavigation: 'reload' }),
    NgxFileDropModule,
    MatSnackBarModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
