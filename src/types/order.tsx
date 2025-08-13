export interface Order {
    id: number;
    userId: number;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}
