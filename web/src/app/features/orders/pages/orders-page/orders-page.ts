import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../shared/interfaces/order';
import { OrdersStore } from '../../../../core/state/orders-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './orders-page.html',
  styleUrls: ['./orders-page.scss'],
})
export class OrdersPage implements OnInit {
  // Signals from store
  filteredOrders = this.store.filteredOrders;
  loading = this.store.loading;
  error = this.store.error;
  statusFilter = this.store.statusFilter;
  searchFilter = this.store.searchFilter;
  totalOrders = this.store.totalOrders;
  totalPages = this.store.totalPages;

  pageS = signal(1);
  limitS = signal(5);
  search = signal('');
  status = signal('');


  // Pagination
  page = 1;
  limit = 5;

  // Status options
  statusOptions: Array<'All' | Order['status']> = [
    'All',
    'pending',
    'processing',
    'shipped',
    'cancelled',
  ];

  constructor(
    public store: OrdersStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to query params
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const status = (params.get('status') as any) || 'All';
      const search = params.get('search') || '';

      this.page = page;
      this.statusFilter.set(status);
      this.searchFilter.set(search);

      this.store.loadOrders({ page: this.page, limit: this.limit });
    });
  }

  // Update URL query params
  private updateQueryParams(params: { page?: number; status?: string; search?: string }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  // Filter handlers
  onStatusChange(event: Event): void {
    const input = event.target as HTMLSelectElement | null;
    if (!input) return;
    this.statusFilter.set(
      input.value as 'pending' | 'processing' | 'shipped' | 'cancelled' | 'All',
    );
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { status: input.value, page: 1 },
        queryParamsHandling: 'merge',
      })
      .catch((err) => console.error('Navigation failed', err));
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.searchFilter.set(input.value);
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { search: input.value, page: 1 },
        queryParamsHandling: 'merge',
      })
      .catch((err) => console.error('Navigation failed', err));
  }

  // Pagination
  onPageChange(newPage: number): void {
   this.updateQuery({ page: newPage })
  }

  // Optimistic actions
  markAsProcessing(orderId: number) {
    this.store.updateOrderStatus(orderId, 'processing');
  }

  shipOrder(orderId: number) {
    this.store.updateOrderStatus(orderId, 'shipped');
  }

  cancelOrder(orderId: number) {
    this.store.updateOrderStatus(orderId, 'cancelled');
  }

  private updateQuery(changes: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageS(),
        limit: this.limitS(),
        search: this.search(),
        status: this.status(),
        ...changes
      },
      queryParamsHandling: 'merge'
    });
  }

  protected readonly Math = Math;
}
