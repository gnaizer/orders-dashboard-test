import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusTimeline } from './order-status-timeline';

describe('OrderStatusTimeline', () => {
  let component: OrderStatusTimeline;
  let fixture: ComponentFixture<OrderStatusTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
