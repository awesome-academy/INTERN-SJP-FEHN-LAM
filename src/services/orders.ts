import { apiClient } from './api';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import { getUserById } from './users';

export const getOrders = (params: string = "") => {
    return apiClient<Order[]>(`/orders${params}`);
};

export const getOrderDetails = () => {
    return apiClient('/order_details');
};

export const getOrderById = (id: string | number) => {
    return apiClient<Order>(`/orders/${id}`);
};

export const updateOrderStatus = (id: string | number, status: string) => {
    return apiClient<Order>(`/orders/${id}`, {
        method: 'PATCH',
        body: { status },
    });
};

export const getOrdersWithUserInfo = async (): Promise<(Order & { user: User })[]> => {
    const orders = await getOrders();

    const ordersWithUser = await Promise.all(
        orders.map(async (order) => {
            try {
                const user = await getUserById(order.userId);
                return { ...order, user };
            } catch {
                return {
                    ...order,
                    user: { id: -1, username: "Người dùng không tồn tại" } as User,
                };
            }
        })
    );
    return ordersWithUser;
};

export const getOrdersWithUserInfoOptimized = () => {

    return apiClient<(Order & { user: User })[]>('/orders?_embed=user');
};
