export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface OrderItem {
  sku: string;
  title: string;
  qty: number;
  price: number;
}

export interface Order {
  id: number;
  createdAt: string; // ISO string
  status: 'pending' | 'processing' | 'shipped' | 'cancelled' | 'delivered';
  customer: Customer;
  items: OrderItem[];
  notes?: string;
  total: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
}

