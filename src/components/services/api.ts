const fetcher = async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Lỗi khi gọi API: ${endpoint}`);
    }
    return await response.json();
}
export const getProducts = () => fetcher('/api/products');
export const getProductReviews = () => fetcher('/api/product_reviews');
export const getCategories = () => fetcher('/api/categories');
export const getOrders = () => fetcher('/api/orders');
export const getOrderDetails = () => fetcher('/api/order_details');
export const getNewProducts = () => fetcher('/api/products?_sort=created_at&_order=desc&_limit=3');

