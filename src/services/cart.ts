import { apiClient } from "./api";
import { Cart, CartItem } from '@/types/cart';

export const getCartByUserId = async (userId: number | string): Promise<Cart | null> => {
    const carts = await apiClient<Cart[]>(`/carts?userId=${userId}`);
    return carts[0] || null;
};

export const getCartItemsByCartId = (cartId: number | string): Promise<CartItem[]> => {
    return apiClient(`/cart_items?cartId=${cartId}`);
};

export const removeCartItem = (cartItemId: number | string) => {
    return apiClient(`/cart_items/${cartItemId}`, {
        method: 'DELETE',
    });
};

export const updateCartItemQuantity = (cartItemId: number | string, quantity: number) => {
    return apiClient<CartItem>(`/cart_items/${cartItemId}`, {
        method: 'PATCH',
        body: { quantity },
    });
};

export const addProductToCart = async (userId: number | string, productId: number, quantity: number) => {
    let cart = await getCartByUserId(userId);

    if (!cart) {
        cart = await apiClient<Cart>('/carts', {
            method: 'POST',
            body: {
                userId: Number(userId),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        });
    }

    const existingItems = await apiClient<CartItem[]>(`/cart_items?cartId=${cart.id}&productId=${productId}`);

    if (existingItems.length > 0) {
        const existingItem = existingItems[0];
        const newQuantity = existingItem.quantity + quantity;
        return updateCartItemQuantity(existingItem.id, newQuantity);
    } else {
        return apiClient<CartItem>('/cart_items', {
            method: 'POST',
            body: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }
};
