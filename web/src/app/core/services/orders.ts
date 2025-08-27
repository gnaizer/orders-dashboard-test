import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Order } from '../../shared/interfaces/order';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private baseUrl = 'http://localhost:3001/orders';

  constructor(private http: HttpClient) {}

  getOrders(options?: {
    search?: string;
    status?: 'pending' | 'processing' | 'shipped' | 'cancelled';
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortField?: keyof Order;
    sortDir?: 'asc' | 'desc';
  }): Observable<Order[]> {
    let params = new HttpParams();
    if (options?.search) params = params.set('q', options.search);
    if (options?.status) params = params.set('status', options.status);
    if (options?.fromDate) params = params.set('createdAt_gte', options.fromDate);
    if (options?.toDate) params = params.set('createdAt_lte', options.toDate);
    if (options?.page) params = params.set('_page', options.page);
    if (options?.limit) params = params.set('_limit', options.limit);
    if (options?.sortField) {
      params = params.set('_sort', options.sortField);
      if (options?.sortDir) params = params.set('_order', options.sortDir);
    }

    return this.http.get<Order[]>(this.baseUrl, { params }).pipe(
      catchError(err => throwError(() => new Error(err?.message || 'Failed to load orders')))
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => throwError(() => new Error(err?.message || 'Failed to load order')))
    );
  }

  updateOrder(id: number, patch: Partial<Pick<Order, 'status' | 'notes'>>): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}`, patch).pipe(
      catchError(err => throwError(() => new Error(err?.message || 'Failed to update order')))
    );
  }
}
