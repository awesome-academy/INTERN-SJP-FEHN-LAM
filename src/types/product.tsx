export interface Product {
    id: number;
    product_name: string;
    price: number;
    description?: string;
    imageUrl: string;
    categoryId: number;
    inStock: boolean;
}
