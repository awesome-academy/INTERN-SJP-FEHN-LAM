import { API_BASE } from "./api";

export const removeCartItem = async (itemId: number | string) => {
    const response = await fetch(`${API_BASE}/cart/${itemId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Không thể xóa sản phẩm");
    return response.json();
};

export const addToCart = async (cartItem: {
    userId: number;
    productId: number;
    quantity: number;
}) => {
    const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
    });
    if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng");
    return response.json();
};

export const getCartByUser = (userId: number) =>
    fetch(`${API_BASE}/cart?userId=${userId}`).then((res) => res.json());
