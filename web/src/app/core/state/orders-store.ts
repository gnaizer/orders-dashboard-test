import { Injectable, signal, computed } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { NotificationService } from '../services/notification';
import { Order } from '../../shared/interfaces/order';
import { OrdersService } from '../services/orders';

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  constructor(private ordersService: OrdersService, private notification: NotificationService) {}

  private ordersSignal = signal<Order[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  statusFilter = signal<'pending' | 'processing' | 'shipped' | 'cancelled' | 'All'>('All');
  searchFilter = signal<string>('');

  readonly orders = computed(() => this.ordersSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  readonly filteredOrders = computed(() =>
    this.ordersSignal().filter(order => {
      const matchesStatus = this.statusFilter() === 'All' || order.status === this.statusFilter();
      const matchesSearch =
        !this.searchFilter() ||
        order.customer.name.toLowerCase().includes(this.searchFilter().toLowerCase());
      return matchesStatus && matchesSearch;
    })
  );

  loadOrders(params: { page?: number; limit?: number } = {}) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.ordersService.getOrders(params)
      .pipe(
        tap({ next: data => this.ordersSignal.set(data) }),
        catchError(err => {
          this.errorSignal.set(err.message);
          this.notification.error(err.message);
          return of([]); // fallback empty array
        })
      )
      .subscribe({ next: () => this.loadingSignal.set(false), error: () => this.loadingSignal.set(false) });
  }

  getOrderById(id: number): Order | undefined {
    return this.ordersSignal().find(o => o.id === id);
  }

  private optimisticUpdate(
    orderId: number,
    changes: Partial<Order>,
    successMsg: string,
    errorMsg: string
  ) {
    const currentOrder = this.getOrderById(orderId);
    if (!currentOrder) return;

    const updatedOrder = { ...currentOrder, ...changes };
    this.ordersSignal.update(orders => orders.map(o => (o.id === orderId ? updatedOrder : o)));

    this.ordersService.updateOrder(orderId, changes)
      .pipe(catchError(() => {
        // rollback
        this.ordersSignal.update(orders => orders.map(o => (o.id === orderId ? currentOrder : o)));
        this.notification.error(errorMsg);
        return of(currentOrder);
      }))
      .subscribe(() => this.notification.success(successMsg));
  }

  updateOrderStatus(orderId: number, status: Order['status']) {
    this.optimisticUpdate(orderId, { status }, `Order #${orderId} updated to ${status}`, `Failed to update order #${orderId}`);
  }

  updateOrderNotes(orderId: number, notes: string) {
    this.optimisticUpdate(orderId, { notes }, `Notes updated for order #${orderId}`, `Failed to update notes for order #${orderId}`);
  }

  markAsShipped(orderId: number) {
    this.updateOrderStatus(orderId, 'shipped');
  }
}
