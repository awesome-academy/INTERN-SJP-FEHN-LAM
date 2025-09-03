import { apiClient } from './api';
import { Product } from '@/types/product';
import { Review } from '@/types/review';

export const getProducts = (params: string = "") => {
    return apiClient<Product[]>(`/products${params}`);
};


export const getNewProducts = () => {
    return getProducts("?_sort=created_at&_order=desc&_limit=8");
};


export const getProductById = (productId: string) => {
    return apiClient<Product>(`/products/${productId}`);
};


export const getRelatedProducts = (productId: number | string) => {
    return apiClient<Product[]>(`/products?related=${productId}&_limit=4`);
};

export const getLimitProduct = (limit: number) => {
    return getProducts(`?_limit=${limit}`);
};

export const createProduct = (productData: Omit<Product, "id">) => {
    return apiClient<Product>('/products', {
        method: 'POST',
        body: productData,
    });
};

export const updateProduct = (id: string | number, productData: Partial<Product>) => {
    return apiClient<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: productData,
    });
};


export const deleteProduct = (id: string | number) => {
    return apiClient(`/products/${id.toString()}`, {
        method: 'DELETE',
    });
};


export const getProductReviews = () => {
    return apiClient<Review[]>('/product_reviews');
};


export const getReviewsByProductId = (productId: number | string) => {
    return apiClient<Review[]>(`/product_reviews?productId=${productId}`);
};

export const searchProducts = (query: string, limit: number = 5) => {
    return apiClient<Product[]>(`/products?q=${query}&_limit=${limit}`);
};
