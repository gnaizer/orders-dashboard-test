export interface OrderFilters {
  search?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'cancelled' | 'delivered';
  fromDate?: string;
  toDate?: string;
  page: number;
  limit: number;
}
