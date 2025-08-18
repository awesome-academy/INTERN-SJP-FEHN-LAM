'use client';
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import React from "react";
import { Product } from "@/types";
const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(
        () => {
            const loadProducts = async () => {
                try {
                    const data = await fetchProducts();
                    setProducts(data);
                    setLoading(false);
                }
                catch (err) {
                    setError("Failed to fetch products");
                }
                finally {
                    setLoading(false);
                }
            }
            loadProducts();
        }, []);
    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="border-b py-2">
                        {product.product_name} - {product.price.toLocaleString()}₫
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ProductList;
