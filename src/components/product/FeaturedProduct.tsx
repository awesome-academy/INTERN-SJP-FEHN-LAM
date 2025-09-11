"use client"
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Review } from '@/types/review';
import { Category } from '@/types/category';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { getProductReviews, getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
interface ProductWithRating extends Product {
    reviewCount: number;
    avgRating: number;
}

const FeaturedProducts = () => {
    const [allProductsWithRatings, setAllProductsWithRatings] = useState<ProductWithRating[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    allProducts,
                    allReviews,
                    allCategories
                ] = await Promise.all([
                    getProducts(),
                    getProductReviews(),
                    getCategories(),
                ]) as [Product[], Review[], Category[]];

                const productsWithRatings: ProductWithRating[] = allProducts.map(product => {
                    const productReviews = allReviews.filter(r => r.productId == product.id);
                    const reviewCount = productReviews.length;
                    const avgRating = reviewCount > 0
                        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
                        : 0;
                    return { ...product, reviewCount, avgRating };
                });

                productsWithRatings.sort((a, b) => {
                    if (a.avgRating !== b.avgRating) return b.avgRating - a.avgRating;
                    return b.reviewCount - a.reviewCount;
                });

                setAllProductsWithRatings(productsWithRatings);
                setReviews(allReviews);
                setCategories(allCategories);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    const displayedProducts = useMemo(() => {
        if (selectedCategoryId === null) {
            return allProductsWithRatings.slice(0, 6);
        }
        return allProductsWithRatings
            .filter(p => p.categoryId == selectedCategoryId)
            .slice(0, 6);
    }, [selectedCategoryId, allProductsWithRatings]);


    if (loading) return <div>Đang tải sản phẩm nổi bật...</div>;
    if (error) return <div className="text-red-500">Lỗi: {error}</div>;

    return (
        <div className="container mx-auto mt-10 p-4">
            <div className="flex items-center justify-between pb-2">
                <h2 className="text-xl font-bold uppercase ml-[20px]">Sản phẩm nổi bật</h2>
            </div>

            <div className="flex flex-col md:flex-row mt-8 gap-6">
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <ul className="space-y-2">
                        <li>
                            <Button
                                variant={selectedCategoryId === null ? "default" : "ghost"}
                                className={`w-full justify-start font-semibold ${selectedCategoryId === null ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-gray-800'}`}
                                onClick={() => setSelectedCategoryId(null)}
                            >
                                Tất cả sản phẩm
                            </Button>
                        </li>

                        {categories.map((category) => (
                            <li key={category.id}>
                                <Button
                                    variant={selectedCategoryId === category.id ? "default" : "ghost"}
                                    className={`w-full justify-start text-gray-600 ${selectedCategoryId === category.id ? 'bg-yellow-500 hover:bg-yellow-600 text-white font-semibold' : 'hover:text-yellow-500'}`}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                >
                                    {category.category_name}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    reviews={reviews}
                                    size='small'
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FeaturedProducts;
