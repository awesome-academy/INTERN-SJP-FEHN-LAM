'use client'
import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import ProductOverview from '@/components/product/ProductOverview';
import { getProductById, getRelatedProducts, getReviewsByProductId } from '@/services/products';
import { getCategories, } from '@/services/categories';
import OwnBreadcrumb from '@/components/breadcumb/OwnBreadcrumb';
import ReviewList from '@/components/product/ReviewList';
import { Review } from '@/types/review';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const paramsData = React.use(params);
    const { id } = paramsData;
    const productId = id

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');
    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Danh mục sản phẩm', href: '/products' },
    ];
    useEffect(() => {


        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [productRes, categoriesRes, reviewRes,] = await Promise.all([
                    getProductById(productId),
                    getCategories(),
                    getReviewsByProductId(productId),
                ]);
                setProduct(productRes);
                setCategories(categoriesRes);
                setReviews(reviewRes);
                if (productRes?.categoryId) {
                    const relatedRes = await getRelatedProducts(productRes.categoryId);
                    setRelatedProducts(
                        relatedRes.filter((p) => String(p.id) !== String(productRes.id))
                    );
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId]);

    if (loading) {
        return <div className="container mx-auto py-8 text-center">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="container mx-auto py-8 text-center text-red-500">Lỗi: {error}</div>;
    }

    if (!product) {
        return <div className="container mx-auto py-8 text-center">Không tìm thấy sản phẩm.</div>;
    }

    const TABS = [
        { id: 'details', label: 'CHI TIẾT SẢN PHẨM' },
        { id: 'reviews', label: 'ĐÁNH GIÁ' },
    ];

    return (
        <div className="container mx-auto py-8">
            <OwnBreadcrumb items={breadcrumbItems} />

            <div className="flex flex-col lg:flex-row gap-12">
                <aside className="w-full lg:w-1/4">
                    <div className="mb-8">
                        <h3 className="font-bold text-sm uppercase tracking-wider border-b pb-3 mb-4">DANH MỤC SẢN PHẨM</h3>
                        <ul>
                            {categories.map(cat => (
                                <li key={cat.id} className="py-2">
                                    <Link href={`/category/${cat.id}`} className="text-sm text-gray-700 hover:text-yellow-600 transition-colors">{cat.category_name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="w-full lg:w-3/4">
                    <ProductOverview product={product} reviews={reviews} />
                    <div>
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex gap-6 " aria-label="Tabs">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer
                                            ${activeTab == tab.id
                                                ? 'border-yellow-500 text-yellow-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="mt-4 text-sm text-gray-700 leading-loose border p-6 rounded-b-md">
                            {activeTab === 'details' && <div>{product.description}</div>}
                            {activeTab === 'reviews' && (
                                <ReviewList reviews={reviews} />
                            )}
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-xl font-bold mb-6">SẢN PHẨM TƯƠNG TỰ</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedProducts.map(item => (
                                <ProductCard product={item} reviews={reviews} size="medium" key={item.id} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
