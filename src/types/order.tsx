export interface Order {
    id: number;
    userId: number;
    username?: string;
    items: OrderItem[];
    total: number;
    status: 'Processing' | 'Shipped' | '' | 'Completed' | 'Cancelled';
    createdAt: string;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}
