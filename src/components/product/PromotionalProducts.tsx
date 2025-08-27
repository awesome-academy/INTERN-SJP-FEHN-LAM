import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import ProductListItem from './ProductListItem';
import { TagIcon } from '@heroicons/react/24/outline';
import { get } from 'http';
import { getLimitProduct } from '@/services/products';

const PromotionalProducts = () => {
    const [promoProducts, setPromoProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromoProducts = async () => {
            setLoading(true);
            const data = await getLimitProduct(5);
            setPromoProducts(data);
            setLoading(false);
        };
        fetchPromoProducts();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-600 uppercase mb-4">
                <TagIcon className="h-5 w-5" />
                Sản phẩm khuyến mãi
            </h3>
            <div className="space-y-4">
                {promoProducts.map(product => (

                    <ProductListItem
                        key={product.id}
                        product={product}
                        size="small"
                        showRating={false}
                        showDescription={false}
                    />
                ))}
            </div>
        </section>
    );
};

export default PromotionalProducts;
