import { addProductToCart, removeCartItem } from "@/services/cart";
import { CartItem, Product } from "@/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from 'zustand/middleware';
interface CartStore {
    items: CartItem[]
    addProductToCart: (product: Product, quantity: number, userId: number) => Promise<void>,
    removeFromCart: (cartItemId: string) => void,
    updateQuantity: (productId: string, quantity: number) => void,
}
export const useCartStore = create(
    persist<CartStore>(
        (set, get) => ({
            items: [],
            addProductToCart: async (product: Product, quantity: number, userId: number) => {
                try {
                    const savedCartItem = await addProductToCart(userId, parseInt(String(product.id)), quantity);

                    toast.success("Đã thêm vào giỏ hàng!");


                    const { items } = get();
                    const existItemInState = items.find((item) => item.productId === savedCartItem.productId);

                    let updatedItems: (CartItem)[];

                    if (existItemInState) {

                        updatedItems = items.map((item) =>
                            item.productId === savedCartItem.productId
                                ? { ...item, ...savedCartItem }
                                : item
                        );
                    } else {
                        const newItemForUI = {
                            ...savedCartItem,
                            product: product,
                        };
                        updatedItems = [...items, newItemForUI];
                    }

                    set({ items: updatedItems });

                } catch (error) {
                    toast.error("Thêm vào giỏ hàng thất bại!");
                    console.error("Lỗi khi thêm vào giỏ hàng:", error);
                }
            },
            removeFromCart: async (cartItemId: string) => {

                try {
                    await removeCartItem(cartItemId);
                    set((state) => ({
                        items: state.items.filter((item) => item.id !== cartItemId)
                    }));
                }
                catch (error) {
                    toast.error("Xóa giỏ hàng thất bại!");
                    console.error(error)
                }
            },
            updateQuantity: async (cartItemId: string, quantity: number) => {

                if (quantity <= 0) {
                    get().removeFromCart(cartItemId)
                }
                else {
                    const now = new Date().toISOString();
                    set((state) => ({
                        items: state.items.map((item) => item.id === cartItemId ? { ...item, quantity: quantity, updated_at: now }
                            : item)
                    }));
                }
            },
        }
        ), {
        name: 'cart-storage',
    }
    )
)
