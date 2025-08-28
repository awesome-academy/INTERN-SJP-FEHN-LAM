"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Product } from "@/types";
import { Review } from "@/types/review";
import { Category } from '@/types/category';
import ProductCard from '@/components/product/ProductCard';
import ProductListItem from '@/components/product/ProductListItem';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { List, LayoutGrid } from 'lucide-react';
import Sidebar from '@/components/product/Sidebar';
import { getProductReviews, getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import OwnBreadcrumb from '@/components/breadcumb/OwnBreadcrumb';

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState('name-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    const PRICE_RANGES_CONFIG = [
        { label: '0 - 200.000 Đ', value: '0-200000' },
        { label: '200.000 Đ - 500.000 Đ', value: '200000-500000' },
        { label: '500.000 Đ - 1.000.000 Đ', value: '500000-1000000' },
        { label: '1.000.000 Đ - 2.000.000 Đ', value: '1000000-2000000' },
        { label: 'Trên 2.000.000 Đ', value: '2000000-Infinity' }
    ];
    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Danh mục sản phẩm', href: '/products' },
    ];
    const sortOptions = [
        { value: 'name-asc', label: 'Tên sản phẩm A-Z' },
        { value: 'name-desc', label: 'Tên sản phẩm Z-A' },
        { value: 'price-asc', label: 'Giá tăng dần' },
        { value: 'price-desc', label: 'Giá giảm dần' },
    ];
    const itemsPerPageOptions = [
        { value: '9', label: 'Show: 9' },
        { value: '12', label: 'Show: 12' },
        { value: '15', label: 'Show: 15' },
    ];
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productResponse, reviewResponse, categoriesRespose] = await Promise.all([
                    getProducts(),
                    getProductReviews(),
                    getCategories(),
                ]);
                setProducts(productResponse);
                setReviews(reviewResponse);
                setCategories(categoriesRespose);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error(errorMessage);
                setProducts([]);
                setReviews([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const { displayedProducts, totalPages } = useMemo(() => {
        let filtered = [...products];


        if (selectedCategoryId !== null) {
            filtered = filtered.filter(p => p.categoryId == selectedCategoryId);
        }
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            filtered = filtered.filter(p => {
                const price = p.price;
                return max == Infinity ? price >= min : price >= min && price <= max;
            });
        }
        const newTotalPages = Math.ceil(filtered.length / itemsPerPage);

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'name-desc': return b.product_name.localeCompare(a.product_name);
                case 'name-asc': default: return a.product_name.localeCompare(b.product_name);
            }
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

        return { displayedProducts: paginated, totalPages: newTotalPages };
    }, [products, selectedCategoryId, selectedPriceRange, sortBy, currentPage, itemsPerPage]);

    const priceRangesWithCount = useMemo(() => {
        if (products.length === 0) {
            return PRICE_RANGES_CONFIG.map(range => ({ ...range, count: 0 }));
        }
        return PRICE_RANGES_CONFIG.map(range => {
            const [min, max] = range.value.split('-').map(Number);
            const count = products.filter(product => {
                const price = product.price;
                return max === Infinity ? price >= min : price >= min && price <= max;
            }).length;
            return { ...range, count };
        });
    }, [products]);


    const handleCategorySelect = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
        setCurrentPage(1);
    };

    const handlePriceSelect = (priceRange: string | null) => {
        setSelectedPriceRange(priceRange);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto py-8">
            <OwnBreadcrumb items={breadcrumbItems} />
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar
                    categories={categories}
                    priceRanges={priceRangesWithCount}
                    onCategorySelect={handleCategorySelect}
                    onPriceSelect={handlePriceSelect}
                    selectedCategoryId={selectedCategoryId}
                />

                <main className="w-full md:w-3/4 lg:w-4/5">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border p-4 rounded-lg mb-6">
                        <div className='flex items-center gap-4'>
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sắp xếp theo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {itemsPerPageOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {loading ? (
                        <p>Đang tải sản phẩm...</p>
                    ) : (
                        <div className={`transition-all duration-300 ${viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'flex flex-col gap-6'}`
                        }>
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map(product =>
                                    viewMode === 'grid' ? (
                                        <ProductCard key={product.id} product={product} reviews={reviews} />
                                    ) : (
                                        <ProductListItem key={product.id} product={product} reviews={reviews} />
                                    )
                                )
                            ) : (
                                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                            )}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(p - 1, 1)); }} />
                                </PaginationItem>
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}>
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(p + 1, totalPages)); }} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
