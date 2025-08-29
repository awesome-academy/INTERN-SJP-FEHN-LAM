
import { apiClient } from './api';
import { Order } from '@/types/order';
import { User } from '@/types/user';

export const getDashboardStats = async () => {
    try {

        const [orders, users] = await Promise.all([
            apiClient<Order[]>('/orders'),
            apiClient<User[]>('/users'),
        ]);

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        return {
            totalRevenue,
            totalOrders: orders.length,
            totalUsers: users.length,
        };
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
        return { totalRevenue: 0, totalOrders: 0, totalUsers: 0 };
    }
};

export const getRevenueByMonth = async () => {
    try {
        const orders = await apiClient<Order[]>('/orders');
        const monthlyRevenue: { [key: string]: number } = {};

        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const key = `${year}-${month}`;
                monthlyRevenue[key] = (monthlyRevenue[key] || 0) + order.total;
            }
        });

        return Object.keys(monthlyRevenue)
            .sort()
            .map((key) => ({
                month: key,
                revenue: monthlyRevenue[key],
            }));
    } catch (error) {
        console.error("Lỗi khi lấy doanh thu theo tháng:", error);
        return [];
    }
};
