import {Routes} from '@angular/router';
import {OrdersPage} from './features/orders/pages/orders-page/orders-page';
import {OrderDetailsPage} from './features/orders/pages/order-details-page/order-details-page';

export const routes: Routes = [
  {
    path: 'orders',
    component: OrdersPage
  },
  {
    path: 'orders/:id',
    component: OrderDetailsPage
  },
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];
