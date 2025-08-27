"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrdersWithUserInfo } from "@/services/orders";
import { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

type OrderWithCustomerName = Order & { username: string };

// ✅ Bước 1: Định nghĩa cấu hình trạng thái đơn hàng (object lookup)
export const ORDER_STATUS_CONFIG = {
    Processing: {
        label: "Đang xử lý",
        badgeVariant: "outline",
    },
    Shipped: {
        label: "Đang giao",
        badgeVariant: "secondary",
    },
    Completed: {
        label: "Hoàn thành",
        badgeVariant: "default",
    },
    Cancelled: {
        label: "Đã hủy",
        badgeVariant: "destructive",
    },
} as const;

// ✅ Bước 2: Tạo component riêng để hiển thị trạng thái đơn hàng
export const OrderStatusBadge = ({ status }: { status: string }) => {
    const config = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG];

    if (!config) {
        return <Badge>{status}</Badge>; // fallback nếu không tìm thấy
    }

    return (
        <Badge variant={config.badgeVariant}>
            {config.label}
        </Badge>
    );
};

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN");

const OrdersTable = ({ orders }: { orders: OrderWithCustomerName[] }) => {
    if (orders.length === 0) {
        return <div className="p-4 text-center text-gray-500">Không có đơn hàng</div>;
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Tổng tiền</TableHead>
                        <TableHead className="text-center">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-medium">
                                ORD{order.id.toString().padStart(3, "0")}
                            </TableCell>
                            <TableCell>{order.username || "Không xác định"}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                                <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-right">
                                {formatCurrency(order.total)}
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" size="sm">
                                    Xem chi tiết
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderWithCustomerName[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrdersWithUserInfo();
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Không thể tải danh sách đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const filteredOrders = {
        processing: orders.filter((o) => o.status === "Processing"),
        shipped: orders.filter((o) => o.status === "Shipped"),
        completed: orders.filter((o) => o.status === "Completed"),
        cancelled: orders.filter((o) => o.status === "Cancelled"),
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý Đơn hàng</h1>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">Tất cả ({orders.length})</TabsTrigger>
                    <TabsTrigger value="Processing">
                        Đang xử lý ({filteredOrders.processing.length})
                    </TabsTrigger>
                    <TabsTrigger value="Shipped">
                        Đang giao ({filteredOrders.shipped.length})
                    </TabsTrigger>
                    <TabsTrigger value="Completed">
                        Hoàn thành ({filteredOrders.completed.length})
                    </TabsTrigger>
                    <TabsTrigger value="Cancelled">
                        Đã hủy ({filteredOrders.cancelled.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <OrdersTable orders={orders} />
                </TabsContent>
                <TabsContent value="Processing" className="mt-4">
                    <OrdersTable orders={filteredOrders.processing} />
                </TabsContent>
                <TabsContent value="Shipped" className="mt-4">
                    <OrdersTable orders={filteredOrders.shipped} />
                </TabsContent>
                <TabsContent value="Completed" className="mt-4">
                    <OrdersTable orders={filteredOrders.completed} />
                </TabsContent>
                <TabsContent value="Cancelled" className="mt-4">
                    <OrdersTable orders={filteredOrders.cancelled} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
