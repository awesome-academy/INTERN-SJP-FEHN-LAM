import { Product } from "./product";
import { User } from "./user";
export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    userId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    paymentMethod: string;
    transactionNo: string;
    user?: User;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: string;
    product: Product;
}
