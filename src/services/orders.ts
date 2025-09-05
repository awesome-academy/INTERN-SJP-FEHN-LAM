import { apiClient } from './api';
import { Order, OrderItem } from '@/types/order';
import { User } from '@/types/user';
import { getUserById } from './users';
import { Product } from '@/types';
import { OrderDetail } from '@/types/order_detail';
import { getProductById } from './products';

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
export const getOrdersByUserId = (userId: string | number) => {
    return apiClient<Order[]>(`/orders?userId=${userId}`);
};
export const getCompleteOrderDetails = async (
    orderId: string | number
): Promise<Order & { user: User; items: (OrderItem & { product: Product })[] }> => {
    const orderWithUser = await apiClient<Order & { user: User }>(
        `/orders/${orderId}?_expand=user`
    );

    if (!orderWithUser || !orderWithUser.items) {
        throw new Error("Không tìm thấy đơn hàng hoặc đơn hàng không có sản phẩm.");
    }

    const detailedItemsPromises = orderWithUser.items.map(async (item) => {
        const productDetails = await getProductById(item.productId);
        return {
            ...item,
            product: productDetails,
        };
    });

    const detailedItems = await Promise.all(detailedItemsPromises);

    return {
        ...orderWithUser,
        items: detailedItems,
    };
};
