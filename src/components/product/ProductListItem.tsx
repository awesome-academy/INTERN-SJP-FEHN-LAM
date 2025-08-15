import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Product } from "@/types";
import { Review } from "@/types/review";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
interface ProductListItemProps {
    product: Product;
    reviews: Review[];
    size?: 'small' | 'medium' | 'large';
}
const ProductListItem: React.FC<ProductListItemProps> = ({ product, reviews, size = 'medium' }) => {
    const productReviews = reviews?.filter(r =>
        r.productId == product.id
    ) || [];
    const reviewCount = productReviews.length;
    const avgRating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;
    const formattedPrice = formatCurrency(product.price);
    return (
        <Card className="p-4 flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-1/4 aspect-square flex-shrink-0">
                <Image
                    src={product.image_url || '/images/placeholder.png'}
                    alt={product.product_name}
                    fill
                    className="object-contain rounded-md"
                    sizes="(max-width: 768px) 100vw, 25vw"
                />
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 uppercase hover:text-amber-600 cursor-pointer">
                    {product.product_name}
                </h3>
                <div className="flex items-center text-xs text-gray-500 my-2">
                    <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < Math.round(avgRating) ? '#f59e0b' : '#e0e0e0'} />
                        ))}
                    </div>
                    ({reviewCount} đánh giá)
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {product.description}
                </p>
                <p className="text-xl text-red-600 font-bold mt-auto pt-4">
                    {formattedPrice}
                </p>
            </div>
        </Card>
    );
};

export default ProductListItem;
