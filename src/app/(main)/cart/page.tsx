'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

import { useAuth } from '@/context/AuthContext';
import { CartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';
import { formatCurrency } from '@/lib/utils';
import { getProductById } from '@/services/products';
import {
    getCartByUserId,
    getCartItemsByCartId,
    removeCartItem,
    updateCartItemQuantity,
} from '@/services/cart';
import { createPaymentUrl } from '@/services/payment';

export interface CartItemWithProduct extends CartItem {
    product: Product;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | number | null>(null);
    const { userId } = useAuth();
    const [isRedirecting, setIsRedirecting] = useState(false);
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setError("Vui lòng đăng nhập để xem giỏ hàng.");
            return;
        }

        const fetchCartData = async () => {
            setLoading(true);
            setError(null);
            try {
                const userCart = await getCartByUserId(userId);
                if (!userCart) {
                    setCartItems([]);
                    return;
                }
                const itemsFromApi = await getCartItemsByCartId(userCart.id);
                if (itemsFromApi.length === 0) {
                    setCartItems([]);
                    return;
                }
                const productPromises = itemsFromApi.map(item => getProductById(item.productId));
                const products = await Promise.all(productPromises);


                const combinedItems = itemsFromApi.map((item, index) => ({
                    ...item,
                    product: products[index],
                }));

                setCartItems(combinedItems);
            } catch (err: any) {
                setError(err.message || "Không thể tải giỏ hàng.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [userId]);

    const handleQuantityChange = async (itemId: string | number, newQuantity: number) => {
        const quantity = Math.max(1, newQuantity);

        setCartItems(currentItems =>
            currentItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
        try {
            await updateCartItemQuantity(itemId, quantity);
        } catch (err) {
            toast.error("Lỗi cập nhật số lượng.");
        }
    };

    const handleRemoveItem = (id: string | number) => {
        setItemToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmRemove = useCallback(async () => {
        if (!itemToDelete) return;

        try {
            await removeCartItem(itemToDelete);
            setCartItems(current => current.filter(item => item.id !== itemToDelete));
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (err) {
            toast.error('Không thể xóa sản phẩm');
        } finally {
            setItemToDelete(null);
            setConfirmOpen(false);
        }
    }, [itemToDelete]);

    const totalAmount = cartItems.reduce(
        (acc, item) => acc + (item.product?.price || 0) * item.quantity,
        0
    );
    const vat = totalAmount * 0.1;
    const finalAmount = totalAmount + vat;
    if (loading) return <div className="container text-center py-12">Đang tải giỏ hàng...</div>;
    if (error) return <div className="container text-center text-red-600 py-12">{error}</div>;

    const handleProceedToCheckout = async () => {
        setIsRedirecting(true);
        try {
            if (!userId) {
                toast.error("Vui lòng đăng nhập để tiếp tục.");
                setIsRedirecting(false);
                return;
            }
            const orderItems = cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const paymentData = {
                amount: finalAmount,
                orderItems: orderItems,
                userId: parseInt(String(userId), 10),
            };
            const { paymentUrl, orderId } = await createPaymentUrl(paymentData);
            if (paymentUrl) {
                localStorage.setItem('currentOrderId', orderId);
                window.location.href = paymentUrl;
            } else {
                toast.error("Không thể tạo yêu cầu thanh toán");
            }
        } catch (error: any) {
            toast.error(error.message || "Đã có lỗi xảy ra");
        } finally {
            setIsRedirecting(false);
        }
    };

    return (
        <div className="font-sans antialiased text-gray-800">
            <main className="container mx-auto py-12 px-4">
                <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <Card className="p-6 text-center">
                        <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
                    </Card>
                ) : (
                    <Card className="mb-8">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="text-center">#</TableHead>
                                    <TableHead>Ảnh</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Đơn giá</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Thành tiền</TableHead>
                                    <TableHead className="text-center">Xóa</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item, index) => (
                                    <TableRow key={item.id} className="border-b border-gray-200">
                                        <TableCell className="py-4 px-4 text-center">{index + 1}</TableCell>
                                        <TableCell className="py-4 px-4">
                                            <Image
                                                src={item.product.image_url}
                                                alt={item.product.product_name}
                                                width={80}
                                                height={80}
                                                className="object-contain"
                                            />
                                        </TableCell>
                                        <TableCell className="py-4 px-4 font-semibold">
                                            {item.product.product_name}
                                        </TableCell>
                                        <TableCell className="py-4 px-4 text-red-600">
                                            {formatCurrency(item.product.price)}
                                        </TableCell>
                                        <TableCell className="py-4 px-4">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                className="w-20 text-center"
                                                onChange={(e) =>
                                                    handleQuantityChange(item.id, parseInt(e.target.value, 10))
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="py-4 px-4 font-bold text-red-600">
                                            {formatCurrency(item.product.price * item.quantity)}
                                        </TableCell>
                                        <TableCell className="py-4 px-4 text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                {cartItems.length > 0 && (
                    <div className="flex justify-end">
                        <Card className="w-full md:w-1/2 lg:w-1/3 p-6">
                            <CardContent className="p-0">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span>Tổng tiền:</span>
                                    <span>{formatCurrency(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span>Thuế (VAT):</span>
                                    <span>{formatCurrency(vat)} </span>
                                </div>
                                <div className="flex justify-between items-center py-2 font-bold text-lg">
                                    <span className="uppercase">Thanh toán:</span>
                                    <span className="text-red-600">{formatCurrency(finalAmount)} </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleProceedToCheckout}
                            disabled={isRedirecting}
                        >
                            {isRedirecting ? 'Đang xử lý...' : 'Tiến hành đặt hàng'}
                        </Button>
                    </div>
                )}
            </main>
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Xác nhận xóa sản phẩm"
                description="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng? Hành động này không thể hoàn tác."
            />
        </div>
    );
}
