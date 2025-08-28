import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../../core/services/orders';
import { Order } from '../../../../shared/interfaces/order';
import { OrdersStore } from '../../../../core/state/orders-store';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details-page.html',
  styleUrls: ['./order-details-page.scss'],
})
export class OrderDetailsPage implements OnInit {
  order: Order | undefined;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private store: OrdersStore,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = this.store.getOrderById(id);
  }

  markAsProcessing() {
    if (!this.order) return;
    this.store.updateOrderStatus(this.order.id, 'processing');
  }

  shipOrder() {
    if (!this.order) return;
    this.store.updateOrderStatus(this.order.id, 'shipped');
  }

  cancelOrder() {
    if (!this.order) return;
    this.store.updateOrderStatus(this.order.id, 'cancelled');
  }
}
