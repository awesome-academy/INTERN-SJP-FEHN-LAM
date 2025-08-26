const API_BASE = 'http://localhost:3001';
const fetcher = async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${endpoint}`);
    }
    return await response.json();
}
export const removeCartItem = async (itemId: number | string) => {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Không thể xóa sản phẩm');
    }

    return response.json();
};
export const addToCart = async (cartItem: {
    userId: number;
    productId: number;
    quantity: number;
}) => {
    const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
        throw new Error('Không thể thêm vào giỏ hàng');
    }

    return response.json();
};
export const getProducts = () => fetcher('/api/products');
export const getProductReviews = () => fetcher('/api/product_reviews');
export const getCategories = () => fetcher('/api/categories');
export const getOrders = () => fetcher('/api/orders');
export const getOrderDetails = () => fetcher('/api/order_details');
export const getNewProducts = () => fetcher('/api/products?_sort=created_at&_order=desc&_limit=3');
export const getProductById = (productId: number | string) =>
    fetcher(`/api/products/${productId}`);
export const getRelatedProducts = (productId: number | string) =>
    fetcher(`/api/products?related=${productId}&_limit=3`);
export const getLimitProduct = (limit: number) => fetcher(`/api/products?_limit=${limit}`);
export const getCartByUser = (userId: number) =>
    fetcher(`/api/cart?userId=${userId}`);
