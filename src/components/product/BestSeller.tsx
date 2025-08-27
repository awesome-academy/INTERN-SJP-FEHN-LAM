"use client"
import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product } from "@/types";
import { Review } from "@/types/review";
import { Category } from '@/types/category';
import { Order } from '@/types/order';
import { OrderDetail } from '@/types/order_detail';
import { Button } from '@/components/ui/button';
import { DEVICE_TABS, OrderStatus, ProductTab } from '@/lib/constants';
import { getProductReviews, getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import { getOrders, getOrderDetails } from '@/services/orders';
import { DeviceTab } from '@/lib/constants';
interface ProductWithSales extends Product {
    totalSold: number;
}

const Bestsellers = () => {
    const [allBestsellers, setAllBestsellers] = useState<ProductWithSales[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<DeviceTab>('Tất cả');
    useEffect(() => {
        const fetchBestsellers = async () => {
            setLoading(true);
            setError(null);
            try {
                const [
                    allProducts,
                    allReviews,
                    allCategories,
                    allOrders,
                    allOrderDetails
                ] = await Promise.all([
                    getProducts(),
                    getProductReviews(),
                    getCategories(),
                    getOrders(),
                    getOrderDetails()
                ]

                ) as [Product[], Review[], Category[], Order[], OrderDetail[]];
                const completedOrderIds = allOrders
                    .filter(order => order.status === OrderStatus.Completed || order.status === OrderStatus.Shipped)
                    .map(order => order.id);
                const salesCountMap = new Map<number, number>();
                allOrderDetails.forEach(detail => {
                    if (completedOrderIds.includes(detail.orderId)) {
                        const currentSoldCount = salesCountMap.get(detail.productId) || 0;
                        salesCountMap.set(detail.productId, currentSoldCount + detail.quantity);
                    }
                });

                const productsWithSales: ProductWithSales[] = allProducts.map(product => ({
                    ...product,
                    totalSold: salesCountMap.get(product.id) || 0
                }));

                productsWithSales.sort((a, b) => b.totalSold - a.totalSold);

                setAllBestsellers(productsWithSales);
                setReviews(allReviews);
                setCategories(allCategories);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchBestsellers();
    }, []);
    const displayedProducts = useMemo(() => {
        let productsToDisplay = allBestsellers;
        if (activeTab !== ProductTab.ALL) {
            const relatedCategory = categories.find(c => c.category_name.toLowerCase().includes(activeTab.toLowerCase()));
            if (relatedCategory) {
                productsToDisplay = allBestsellers.filter(p => p.categoryId === relatedCategory.id);
            } else {
                productsToDisplay = [];
            }
        }
        return productsToDisplay.slice(0, 5);
    }, [activeTab, allBestsellers, categories]);

    if (loading) {
        return <div>Đang tải sản phẩm bán chạy...</div>;
    }

    const mainProduct = displayedProducts[0];
    const sideProducts = displayedProducts.slice(1);

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase mr-100">Sản phẩm bán chạy</h2>
                <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
                    {DEVICE_TABS.map(tab => (
                        <Button
                            key={tab}
                            variant="ghost"
                            onClick={() => setActiveTab(tab)}
                            className={`pb-1 transition-colors ${activeTab === tab ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500 hover:text-amber-600'}`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>

            {mainProduct ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="hidden md:flex flex-col gap-6">
                        {sideProducts.slice(0, 2).map(product => (
                            <ProductCard key={product.id} product={product} reviews={reviews} size="small" />
                        ))}
                    </div>
                    <div className="md:col-span-2">
                        <ProductCard product={mainProduct} reviews={reviews} size="large" />
                    </div>
                    <div className="hidden md:flex flex-col gap-6">
                        {sideProducts.slice(2, 4).map(product => (
                            <ProductCard key={product.id} product={product} reviews={reviews} size="small" />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-10">Không có sản phẩm bán chạy nào trong mục này.</p>
            )}
        </section>
    );
};

export default Bestsellers;
