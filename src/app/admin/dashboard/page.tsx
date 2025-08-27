"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { getDashboardStats, getRevenueByMonth } from "@/services/dashboard";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";

export default function DashboardPage() {
    const [stats, setStats] = useState<{
        totalRevenue: number;
        totalOrders: number;
        totalUsers: number;
    }>({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
    });

    const [revenueData, setRevenueData] = useState<
        { month: string; revenue: number }[]
    >([]);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        const fetchRevenue = async () => {
            const data = await getRevenueByMonth();
            setRevenueData(data);
        };

        fetchStats();
        fetchRevenue();
    }, []);

    const formattedStats = [
        {
            title: "Tổng doanh thu",
            value: `${stats.totalRevenue.toLocaleString()}đ`,
            icon: DollarSign,
        },
        {
            title: "Tổng đơn hàng",
            value: `+${stats.totalOrders}`,
            icon: ShoppingCart,
        },
        {
            title: "Người dùng mới",
            value: `+${stats.totalUsers}`,
            icon: Users,
        },
        { title: "Lượt truy cập", value: "12,345", icon: Activity },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {formattedStats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueData.length > 0 ? (

                            <RevenueChart data={revenueData} />
                        ) : (
                            <div className="h-80 w-full bg-muted/50 flex items-center justify-center rounded-md">
                                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
