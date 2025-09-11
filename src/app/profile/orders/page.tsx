'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrdersByUserId } from '@/services/orders';
import { Order, User } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatusBadge } from '@/app/admin/orders/page';
import { getUserById } from '@/services/users';
import { toast } from 'react-toastify';
import { CustomPagination } from '@/components/Pagination';
import { string } from 'zod';
import OrderDetailDialog from '@/components/orders/OrderDetailDialog';
import { useSession } from 'next-auth/react';


const MyOrdersPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession()
    const userId = session?.user?.id;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User>();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const currentOrder = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    useEffect(() => {
        const fetchUserData = async () => {
            if (!session) {
                router.push('/login');
                return;
            }

            if (userId) {
                try {
                    const userData = await getUserById(userId);
                    setUser(userData);

                } catch (error) {
                    toast.error('Không thể tải thông tin người dùng');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [session, userId, router]);
    const handlePageChange = (page: number) => {
        router.push(`?page=${page}`);
    };

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        const fetchUserOrders = async () => {
            if (userId) {
                try {
                    const userOrders = await getOrdersByUserId(userId);
                    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setOrders(userOrders);
                } catch (err) {
                    setError("Không thể tải lịch sử đơn hàng của bạn.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchUserOrders();
    }, [session, userId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tài khoản</CardTitle>
                                <CardDescription>
                                    Quản lý thông tin và đơn hàng của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-600">
                                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold">{user?.username || 'Người dùng'}</h3>
                                    <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                                </div>
                                <nav className="space-y-2">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Thông tin tài khoản
                                    </Link>
                                    <Link
                                        href="/profile/orders"
                                        className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium"
                                    >
                                        Đơn hàng của tôi
                                    </Link>
                                    <Link
                                        href="/profile/change-password"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Đổi mật khẩu
                                    </Link>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Đơn hàng của tôi</CardTitle>
                                <CardDescription>
                                    Theo dõi tất cả các đơn hàng đã đặt
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && <p className="text-red-500 text-center">{error}</p>}
                                {!error && orders.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">Bạn chưa có đơn hàng nào.</p>
                                ) : (
                                    <div className="rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Mã đơn hàng</TableHead>
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
                                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                                        <TableCell>
                                                            <OrderStatusBadge status={order.status} />
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold text-red-600">
                                                            {formatCurrency(order.total)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Button variant="outline" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                                                                Xem chi tiết
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {selectedOrderId && (
                                                    <OrderDetailDialog
                                                        orderId={selectedOrderId}
                                                        open={!!selectedOrderId}
                                                        onOpenChange={(open) => !open && setSelectedOrderId("")}
                                                    />
                                                )}
                                            </TableBody>
                                        </Table>

                                        {totalPages > 1 && (
                                            <CustomPagination
                                                total={totalPages}
                                                currentPage={currentPage}
                                                onPageChange={handlePageChange}
                                            />
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
