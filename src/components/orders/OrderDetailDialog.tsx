"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
    Dialog,
    DialogContent,

} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getCompleteOrderDetails } from "@/services/orders";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "@/app/admin/orders/page";

interface OrderDetailDialogProps {
    orderId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function OrderDetailDialog({
    orderId,
    open,
    onOpenChange,
}: OrderDetailDialogProps) {
    const { userId } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !userId) return;
        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const orderData = await getCompleteOrderDetails(orderId);
                if (orderData.userId != userId && orderData.user.role == "ADMIN") {
                    throw new Error("Bạn không có quyền xem đơn hàng này.");
                }
                setOrder(orderData);
            } catch (err: any) {
                setError(err.message || "Không thể tải chi tiết đơn hàng.");
                console.error("Lỗi:", err)
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [open, userId, orderId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-5xl w-[calc(100%-4rem)] h-[calc(65vh-1rem)] flex flex-col p-6"
            >

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600 py-12">{error}</div>
                ) : order ? (
                    <Card className="border-none shadow-none">
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-0">
                            <div>
                                <CardTitle className="text-xl">
                                    Đơn hàng: ORD{order.id.toString().padStart(3, "0")}
                                </CardTitle>
                                <CardDescription>
                                    Đặt ngày: {formatDate(order.createdAt)}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Trạng thái:</span>
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </CardHeader>

                        <CardContent className="px-0">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Thông tin giao hàng</h3>
                                <p className="text-sm text-gray-600">{order.user?.username}</p>
                                <p className="text-sm text-gray-600">{order.user?.address}</p>
                                <p className="text-sm text-gray-600">{order.user?.phone}</p>
                                <p className="text-sm text-gray-600">{order.user?.email}</p>
                            </div>

                            <h3 className="font-semibold mb-4">Chi tiết sản phẩm</h3>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Ảnh</TableHead>
                                            <TableHead>Sản phẩm</TableHead>
                                            <TableHead className="text-center">Số lượng</TableHead>
                                            <TableHead className="text-right">Đơn giá</TableHead>
                                            <TableHead className="text-right">Thành tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item) => (
                                            <TableRow key={item.productId}>
                                                <TableCell>
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.product_name}
                                                        width={64}
                                                        height={64}
                                                        className="rounded-md object-contain"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.product.product_name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(Number(item.price))}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(Number(item.price) * item.quantity)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end mt-6">
                                <div className="w-full md:w-1/3 space-y-2">
                                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                        <span>Tổng cộng:</span>
                                        <span className="text-red-600">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : null}


            </DialogContent>
        </Dialog>
    );
}
