export interface Product {
    id: string;
    product_name: string;
    price: number;
    description?: string;
    categoryId: number;
    inStock: boolean;
    image_url: string;
    brand: string;
    createdAt: string;
    updatedAt: string;
    stock_quantity: number;
    size: [];
    color: [string];
}
