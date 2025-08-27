import { API_BASE, fetcher } from "./api";
import { Order } from "@/types";

export const getDashboardStats = async () => {
    try {
        const [orders, users] = await Promise.all([
            fetcher(`${API_BASE}/orders`),
            fetcher(`${API_BASE}/users`),
        ]);

        const totalRevenue = orders.reduce(
            (sum: number, order: Order) => sum + order.total,
            0
        );
        return {
            totalRevenue,
            totalOrders: orders.length,
            totalUsers: users.length,
        };
    } catch {
        return { totalRevenue: 0, totalOrders: 0, totalUsers: 0 };
    }
};

export const getRevenueByMonth = async () => {
    try {
        const orders: Order[] = await fetcher(`${API_BASE}/orders`);
        const monthlyRevenue: { [key: string]: number } = {};
        orders.forEach((order) => {
            const date = new Date(order.createdAt);
            const month = String(date.getMonth() + 1).padStart(2, "0");
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
        });
        return Object.keys(monthlyRevenue).map((month) => ({
            month,
            revenue: monthlyRevenue[month],
        }));
    } catch {
        return [];
    }
};
