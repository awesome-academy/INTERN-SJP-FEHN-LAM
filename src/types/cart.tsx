import { Product } from './product';
export interface CartItem {
    productId: number;
    product: Product;
    quantity: number;
}
