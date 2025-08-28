import { User, Order } from "@/types";
import { API_BASE, fetcher } from "./api";
import { getUserById } from "./users";

export const getOrders = () => fetcher("/api/orders");
export const getOrderDetails = () => fetcher("/api/order_details");

export const getOrdersWithUserInfo = async (): Promise<
    (Order & { user: User })[]
> => {
    const orders: Order[] = await getOrders();
    return Promise.all(
        orders.map(async (order: Order) => {
            try {
                const user: User = await getUserById(order.userId);
                return { ...order, user };
            } catch {
                return {
                    ...order,
                    user: { id: -1, username: "Khách hàng không xác định" } as User,
                };
            }
        })
    );
};

export const getOrderById = async (id: string | number) => {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (!response.ok) throw new Error("Không thể tìm thấy đơn hàng");
    return response.json();
};

export const updateOrderStatus = async (id: string | number, status: string) => {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng");
    return response.json();
};
