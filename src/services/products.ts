import { Product } from "@/types";
import { API_BASE, fetcher } from "./api";

export const getProducts = () => fetcher("/api/products");
export const getProductReviews = () => fetcher("/api/product_reviews");
export const getNewProducts = () =>
    fetcher("/api/products?_sort=created_at&_order=desc&_limit=3");
export const getProductById = (productId: number | string) =>
    fetcher(`/api/products/${productId}`);
export const getRelatedProducts = (productId: number | string) =>
    fetcher(`/api/products?related=${productId}&_limit=3`);
export const getLimitProduct = (limit: number) =>
    fetcher(`/api/products?_limit=${limit}`);

export const createProduct = async (productData: Omit<Product, "id">) => {
    const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Không thể tạo sản phẩm");
    return response.json();
};

export const updateProduct = async (
    id: string | number,
    productData: Partial<Product>
) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error("Không thể cập nhật sản phẩm");
    return response.json();
};

export const deleteProduct = async (id: string | number) => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Không thể xóa sản phẩm");
    return response.json();
};
