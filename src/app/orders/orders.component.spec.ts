import { TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { type OrderDraft } from './models/order.model';

describe('OrdersComponent', () => {
  let component: OrdersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
  });

  it('should update an order when editing and remove it when deleted', () => {
    const initialOrder: OrderDraft = {
      id: '1',
      tableNumber: 3,
      drinks: [],
      buffetCount: 0,
      carteCount: 0,
      carteComment: '',
      status: 'in-progress',
    };

    component.addOrder(initialOrder);

    component.startEdit(initialOrder);
    expect(component.editingOrder()?.status).toBe('in-progress');

    const updatedOrder: OrderDraft = {
      ...initialOrder,
      tableNumber: 5,
      status: 'in-progress',
    };

    component.saveOrder(updatedOrder);
    expect(component.orders()[0].tableNumber).toBe(5);

    component.deleteOrder(updatedOrder.id);
    expect(component.orders()).toHaveLength(0);
  });

  it('should mark an order as completed', () => {
    const order: OrderDraft = {
      id: '2',
      tableNumber: 8,
      drinks: [],
      buffetCount: 0,
      carteCount: 0,
      carteComment: '',
      status: 'in-progress',
    };

    component.addOrder(order);
    component.markCompleted(order.id);

    expect(component.orders()[0].status).toBe('completed');
  });
});
