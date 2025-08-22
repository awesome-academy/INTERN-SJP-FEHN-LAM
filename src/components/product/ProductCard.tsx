import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { Product } from "@/types";
import { Review } from "@/types/review";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
interface ProductCardProps {
    product: Product;
    reviews: Review[];
    size?: 'small' | 'medium' | 'large';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, reviews, size = 'medium' }) => {
    const productReviews = reviews?.filter(r =>
        String(r.productId) === String(product.id)
    ) || [];

    const reviewCount = productReviews.length;
    const avgRating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;

    const formattedPrice = formatCurrency(product.price);
    const sizeStyles = {
        small: {
            padding: "p-2",
            imageHeight: "h-24",
            title: "text-xs line-clamp-2",
            price: "text-sm",
            rating: "text-xs",
        },
        medium: {
            padding: "p-3",
            imageHeight: "h-40",
            title: "text-sm line-clamp-2",
            price: "text-base md:text-lg",
            rating: "text-xs",
        },
        large: {
            padding: "p-4",
            imageHeight: "h-60",
            title: "text-base lg:text-lg line-clamp-2",
            price: "text-lg md:text-xl",
            rating: "text-sm",
        },
    };

    const styles = sizeStyles[size];

    return (
        <Card
            className={`text-center group hover:shadow-lg transition-all duration-300 ${styles.padding} border border-transparent hover:border-gray-200`}
        >
            <div className={`relative w-full ${styles.imageHeight} mb-3 overflow-hidden rounded-lg`}>
                <Image
                    src={product.image_url || '/images/placeholder.png'}
                    alt={product.product_name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <CardContent className="p-0">
                <h3 className={`font-semibold text-gray-800 uppercase mb-1.5 leading-tight ${styles.title}`}>
                    {product.product_name}
                </h3>
                <p className={`text-red-600 font-bold mb-2 ${styles.price}`}>
                    {formattedPrice}
                </p>

                <div className={`flex items-center justify-center ${styles.rating} text-gray-500`}>
                    <div className="flex text-yellow-400 mr-1.5">
                        {[...Array(5)].map((_, i) => {
                            const isFull = i < Math.floor(avgRating);
                            const isHalf = i === Math.floor(avgRating) && avgRating % 1 >= 0.5;
                            return (
                                <FaStar
                                    key={i}
                                    color={isFull || isHalf ? '#f59e0b' : '#e0e0e0'}
                                    style={{ opacity: isHalf ? 0.6 : 1 }}
                                />
                            );
                        })}
                    </div>
                    <span>({reviewCount} đánh giá)</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
