"use client"
import React, { useState, useEffect } from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import ProductCard from './ProductCard';
import { Product } from "@/types"
import { Review } from "@/types/review";
import { getProductReviews, getNewProducts } from '@/services/products';
const NewProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsResponse, reviewResponse] = await Promise.all([
                    getNewProducts(),
                    getProductReviews(),
                ]);
                setProducts(productsResponse);
                setReviews(reviewResponse);

            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    if (loading) {
        return (
            <section className="py-12">
                <div className="flex justify-start items-center mb-4">
                    <h2 className="text-2xl font-bold uppercase ml-[250px] ">Sản phẩm mới</h2>
                    <a href="/products?sort=newest" className="ml-auto flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 mr-[50px]">
                        Xem tất cả <HiArrowRight />
                    </a>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 ">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg "></div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold uppercase">Sản phẩm mới</h2>
                    <a href="/products?sort=newest" className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600">
                        Xem tất cả <HiArrowRight />
                    </a>
                </div>
                <div className="text-center text-red-500">
                    Lỗi tải dữ liệu: {error}
                </div>
            </section>
        );
    }

    return (
        <section className="py-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold uppercase ml-[180px]">Sản phẩm mới</h2>
                <a href="/products?sort=newest" className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-600 mr-[250px]">
                    Xem tất cả <HiArrowRight />
                </a>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            reviews={reviews}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">Không có sản phẩm mới.</p>
                )}
            </div>
        </section>
    );
};

export default NewProducts;
