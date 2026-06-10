export type OrderStatus = 'in-progress' | 'completed';
export type OrderItemStatus = 'confirmed' | 'new';

export interface OrderDrink {
  name: string;
  size: '0.3L' | '0.5L';
  quantity: number;
  status: OrderItemStatus;
}

export interface OrderDraft {
  id: string;
  tableNumber: number;
  drinks: OrderDrink[];
  buffetCount: number;
  buffetStatus?: OrderItemStatus;
  carteCount: number;
  carteStatus?: OrderItemStatus;
  carteComment: string;
  status: OrderStatus;
}