'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { Review } from '@/types/review';
import { useCallback, useEffect, useState } from 'react';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaShareAlt } from 'react-icons/fa';
import { Input } from '../ui/input';
import { addProductToCart } from '@/services/cart';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import ReviewDialog from './ReviewDialog';
import { submitReview } from '@/services/review';
interface ProductOverviewProps {
    product: Product;
    reviews?: Review[];
}

export default function ProductOverview({ product, reviews }: ProductOverviewProps) {
    const { userId, isLoggedIn } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const productReviews = reviews?.filter(r =>
        r.productId == product.id
    ) || [];
    const reviewCount = productReviews.length;
    const avgRating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;
    const handleAddtoCart = async () => {
        try {
            if (!userId) {
                toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!");
                return;
            }
            await addProductToCart(userId, parseInt(product.id), quantity);
            toast.success('Đã thêm vào giỏ hàng!')
        } catch (error) {
            toast.error(' Thêm vào giỏ hàng thất bại!')
        }
    }
    const handleReviewSubmit = useCallback(async (review: { rating: number; comment: string }) => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập để gửi bình luận.");
            return;
        }

        try {
            await submitReview({
                productId: product.id,
                userId,
                rating: review.rating,
                comment: review.comment,
            });
            toast.success("Cảm ơn bạn đã gửi bình luận!");
            setIsReviewDialogOpen(false);
        } catch (error) {
            toast.error("Không thể gửi bình luận.");
        }
    }, [userId, product.id]);
    return (
        <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-1/2">
                <div className="p-4 flex justify-center items-center bg-white">
                    <Image
                        src={product.image_url}
                        alt={product.product_name}
                        width={600}
                        height={600}
                        className="max-w-full h-auto max-h-96 object-contain"
                        priority
                    />
                </div>
            </div>
            <div className="w-full md:w-1/2">
                <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>

                <div className="flex items-center text-sm text-yellow-500 mb-2">
                    <span className="mr-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`inline-block ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                            </span>
                        ))}
                    </span>
                    <span className="text-gray-600 ml-1">({reviewCount} Đánh giá)</span>
                    <span className="mx-2">|</span>
                    <button
                        onClick={() => {
                            if (!isLoggedIn) {
                                toast.error("Vui lòng đăng nhập để gửi bình luận.");
                                return;
                            }
                            setIsReviewDialogOpen(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-xs underline cursor-pointer"
                    >
                        Gửi bình luận của bạn
                    </button>
                </div>
                <div className="my-4">
                    <span className="text-3xl font-bold text-red-600">
                        GNY: {parseFloat(product.price.toString()).toLocaleString('vi-VN')} Đ
                    </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {product.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="-- Chọn size --" />
                            </SelectTrigger>
                            <SelectContent>
                                {product.size.map(size => (
                                    <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc:</label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="-- Chọn màu --" />
                            </SelectTrigger>
                            <SelectContent>
                                {product.color.map(color => (
                                    <SelectItem key={color} value={color}>{color}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min="1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black flex-grow cursor-pointer"
                    onClick={handleAddtoCart}
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Thêm vào giỏ hàng
                </Button>
                <div className="flex gap-2 mt-4">
                    <button className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer">
                        <FaFacebookF className="w-4 h-4 mr-1" />
                        Like
                    </button>
                    <button className="flex items-center px-2 py-1 bg-blue-400 text-white text-xs rounded cursor-pointer"  >
                        <FaTwitter className="w-4 h-4 mr-1" />
                        Tweet
                    </button>
                    <button className="flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded cursor-pointer">
                        <FaGooglePlusG className="w-4 h-4 mr-1" />
                        G+
                    </button>
                    <button className="flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded cursor-pointer">
                        <FaShareAlt className="w-4 h-4 mr-1" />
                        Share
                    </button>
                </div>
            </div>
            <ReviewDialog
                isOpen={isReviewDialogOpen}
                onOpenChange={setIsReviewDialogOpen}
                productId={product.id}
                onSubmit={handleReviewSubmit}
            />
        </div>
    );
};



