import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../shared/interfaces/order';
import { OrdersStore } from '../../../../core/state/orders-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './orders-page.html',
  styleUrls: ['./orders-page.scss'],
})
@UntilDestroy()

export class OrdersPage implements OnInit {
  filteredOrders = this.store.filteredOrders;
  loading = this.store.loading;
  error = this.store.error;
  statusFilter = this.store.statusFilter;
  searchFilter = this.store.searchFilter;
  fromDateFilter = this.store.fromDateFilter;
  toDateFilter = this.store.toDateFilter;
  sortField  = this.store.sortField;
  sortDir = this.store.sortDir;
  totalOrders = this.store.totalOrders;
  totalPages = this.store.totalPages;

  page = 1;
  limit = 5;
  fromDate: string | null = null;
  toDate: string | null = null;
  currentSortField: keyof Order | null = null;
  currentSortDir: 'asc' | 'desc' | null = null;
  statusOptions: Array<'All' | Order['status']> = [
    'All',
    'pending',
    'processing',
    'shipped',
    'cancelled',
    'delivered'
  ];

  constructor(
    public store: OrdersStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkQueryParamsAndLoadOrders();
  }

  checkQueryParamsAndLoadOrders(): void {
    this.route.queryParamMap.pipe(untilDestroyed(this)).subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const status = (params.get('status') as any) || 'All';
      const search = params.get('search') || '';
      const fromDate = params.get('fromDate') || '';
      const toDate = params.get('toDate') || '';

      this.page = page;
      this.statusFilter.set(status);
      this.searchFilter.set(search);
      this.fromDateFilter.set(fromDate);
      this.toDateFilter.set(toDate);

      this.store.loadOrders({ page: this.page, limit: this.limit });
    });
  }

  onDateRangeChange(range: { from: string, to: string }) {
    this.fromDate = range.from;
    this.toDate = range.to;
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { fromDate: this.fromDate, toDate: this.toDate, page: this.page },
        queryParamsHandling: 'merge',
      })
      .catch((err) => console.error('Navigation failed', err));
  }

  onStatusChange(event: Event): void {
    const input = event.target as HTMLSelectElement | null;
    if (!input) return;
    this.statusFilter.set(
      input.value as 'pending' | 'processing' | 'shipped' | 'cancelled' | 'delivered' | 'All',
    );
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { status: input.value, page: this.page },
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
        queryParams: { search: input.value, page: this.page },
        queryParamsHandling: 'merge',
      })
      .catch((err) => console.error('Navigation failed', err));
  }

  resetFilters() {
    this.store.searchFilter.set('');
    this.store.statusFilter.set('All');
    this.store.fromDateFilter.set('');
    this.store.toDateFilter.set('');
    this.fromDate = '';
    this.toDate = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    }).catch(console.error);
    this.store.loadOrders({ page: this.page, limit: this.limit });
  }

  public updateQueryParams(params: {
    page?: number | null;
    status?: string | null;
    search?: string | null;
    fromDate?: string | null;
    toDate?: string | null;
    sortField?: string | null;
    sortDir?: 'asc' | 'desc' | null;
  }): void {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== null && v !== undefined)
    );

    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: cleanParams,
        queryParamsHandling: 'merge',
      })
      .catch((err) => console.error('Navigation failed', err));
  }

  toggleDateSort(): void {
    if (this.sortField() !== 'createdAt') {
      this.sortField.set('createdAt');
      this.sortDir.set('asc');
    } else if (this.sortDir() === 'asc') {
      this.sortDir.set('desc');
    }

    this.updateQueryParams({
      sortField: this.sortField(),
      sortDir: this.sortDir(),
    });
  }

  onPageChange(newPage: number): void {
    this.updateQueryParams({ page: newPage });
  }

  markAsProcessing(orderId: number) {
    this.store.updateOrderStatus(orderId, 'processing');
  }

  shipOrder(orderId: number) {
    this.store.updateOrderStatus(orderId, 'shipped');
  }

  cancelOrder(orderId: number) {
    this.store.updateOrderStatus(orderId, 'cancelled');
  }
}
