import { Routes } from '@angular/router';
import { DndComponent } from './components/dnd/dnd.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { EmptyComponent } from './components/empty/empty.component';
import { MyInvoicesComponent } from './components/my-invoices/my-invoices.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: DndComponent
  },
  {
    path: 'review/:uploadTimestamp',
    component: InvoiceListComponent
  },
  {
    path: 'my-invoices',
    component: MyInvoicesComponent
  },
  {
    path: 'boc-callback',
    component: EmptyComponent
  }
];
