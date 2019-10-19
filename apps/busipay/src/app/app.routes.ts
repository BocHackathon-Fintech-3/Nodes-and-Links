import { Routes } from '@angular/router';
import { DndComponent } from './components/dnd/dnd.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';
import { EmptyComponent } from './components/empty/empty.component';

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
    path: 'boc-callback',
    component: EmptyComponent
  }
];
