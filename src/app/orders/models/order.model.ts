export type OrderStatus = 'in-progress' | 'completed';
export type OrderItemStatus = 'confirmed' | 'new';

export interface OrderDrink {
  name: string;
  size: '0.1L' | '0.2L' | '0.3L' | '0.5L' | '0.75L';
  quantity: number;
  status: OrderItemStatus;
}

export interface OrderDraft {
  id: string;
  tableNumber: number;
  drinks: OrderDrink[];
  buffetCount: number;       // Summe: Erwachsene + Kinder
  buffetAdults: number;      // davon Erwachsene
  buffetChildren: number;    // davon Kinder
  buffetStatus?: OrderItemStatus;
  carteCount: number;
  carteStatus?: OrderItemStatus;
  carteComment: string;
  status: OrderStatus;
}