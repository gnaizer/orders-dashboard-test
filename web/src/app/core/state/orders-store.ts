import { Injectable, signal, computed } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { NotificationService } from '../services/notification';
import { Order } from '../../shared/interfaces/order';
import { OrdersService } from '../services/orders';
import { OrderFilters } from '../../shared/interfaces/filters';

@Injectable({ providedIn: 'root' })
export class OrdersStore {
  constructor(
    private ordersService: OrdersService,
    private notification: NotificationService,
  ) {}

  private ordersSignal = signal<Order[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private totalOrdersSignal = signal<number>(0);

  totalPagesSignal = signal<number>(0);
  statusFilter = signal<'pending' | 'processing' | 'shipped' | 'cancelled' | 'delivered' | 'All'>('All');
  searchFilter = signal<string>('');
  fromDateFilter = signal<string>('');
  toDateFilter = signal<string>('');
  sortField = signal<keyof Order | null>(null);
  sortDir = signal<'asc' | 'desc' | null>(null);


  readonly orders = computed(() => this.ordersSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly totalOrders = computed(() => this.totalOrdersSignal());
  readonly totalPages = computed(() => this.totalPagesSignal());

  readonly filteredOrders = computed(() => {
    const status = this.statusFilter();
    const search = this.searchFilter()?.toLowerCase() || '';
    const fromDate = this.fromDateFilter();
    const toDate = this.toDateFilter();
    const sortField = this.sortField();   // signal for current sort field
    const sortDir = this.sortDir();       // signal for asc/desc

    return [...this.ordersSignal()] // copy array to avoid mutating the signal
      .filter(order => {
        const createdAt = new Date(order.createdAt);

        const matchesStatus =
          status === 'All' || order.status === status;

        const matchesSearch =
          !search ||
          order.customer.name.toLowerCase().includes(search) ||
          order.items.some(item =>
            item.title.toLowerCase().includes(search) ||
            item.sku.toLowerCase().includes(search)
          );

        const matchesFromDate =
          !fromDate || createdAt >= new Date(fromDate);

        const matchesToDate =
          !toDate || createdAt <= new Date(toDate);

        return (
          matchesStatus &&
          matchesSearch &&
          matchesFromDate &&
          matchesToDate
        );
      })
      .sort((a, b) => {
        if (!sortField) return 0;

        let aVal = a[sortField as keyof Order];
        let bVal = b[sortField as keyof Order];

        if (sortField === 'createdAt') {
          aVal = new Date(aVal as string).getTime();
          bVal = new Date(bVal as string).getTime();
        }

        if (aVal == null || bVal == null) return 0;

        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  });


  loadOrders(params: { fromDate?: string, toDate?: string, page?: number; limit?: number } = {}) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.ordersService
      .getOrders(params)
      .pipe(
        tap({
          next: (data) => {
            this.ordersSignal.set(data.orders);
            if (params.limit !== undefined && params.limit !== null) {
              this.totalPagesSignal.set(Math.ceil(data.total/params.limit))
            }
            this.totalOrdersSignal.set(data.total);
          },
        }),
        catchError((err) => {
          this.errorSignal.set(err.message);
          this.notification.error(err.message);
          return of([]); // fallback empty array
        }),
      )
      .subscribe({
        next: () => this.loadingSignal.set(false),
        error: () => this.loadingSignal.set(false),
      });
  }

  getOrderById(id: number): Order | undefined {
    return this.ordersSignal().find((o) => o.id === id);
  }

  private optimisticUpdate(
    orderId: number,
    changes: Partial<Order>,
    successMsg: string,
    errorMsg: string,
  ) {
    const currentOrder = this.getOrderById(orderId);
    if (!currentOrder) return;

    const updatedOrder = { ...currentOrder, ...changes };
    this.ordersSignal.update((orders) => orders.map((o) => (o.id === orderId ? updatedOrder : o)));

    this.ordersService
      .updateOrder(orderId, changes)
      .pipe(
        catchError(() => {
          this.ordersSignal.update((orders) =>
            orders.map((o) => (o.id === orderId ? currentOrder : o)),
          );
          this.notification.error(errorMsg);
          return of(currentOrder);
        }),
      )
      .subscribe(() => this.notification.success(successMsg));
  }

  updateOrderStatus(orderId: number, status: Order['status']) {
    this.optimisticUpdate(
      orderId,
      { status },
      `Order #${orderId} updated to ${status}`,
      `Failed to update order #${orderId}`,
    );
  }

  updateOrderNotes(orderId: number, notes: string) {
    this.optimisticUpdate(
      orderId,
      { notes },
      `Notes updated for order #${orderId}`,
      `Failed to update notes for order #${orderId}`,
    );
  }

  markAsShipped(orderId: number) {
    this.updateOrderStatus(orderId, 'shipped');
  }
}
