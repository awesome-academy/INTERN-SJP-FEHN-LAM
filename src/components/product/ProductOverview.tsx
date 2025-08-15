// components/ProductOverview.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaShareAlt } from 'react-icons/fa';

interface ProductOverviewProps {
    product: Product;
}

export default function ProductOverview({ product }: ProductOverviewProps) {
    const [quantity, setQuantity] = useState(1);


    const rating = 4.5;
    const reviewCount = 12;

    return (
        <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-full md:w-1/2">
                <div className="p-4 flex justify-center items-center bg-white">
                    <Image
                        src={product.image_url}
                        alt={product.product_name}
                        width={600}
                        height={600}
                        className="max-w-full h-auto max-h-96 object-contain rounded-lg border"
                        priority
                    />
                </div>
            </div>
            <div className="w-full md:w-1/2">
                <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>

                <div className="flex items-center text-sm text-yellow-500 mb-2">
                    <span className="mr-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`inline-block ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                            </span>
                        ))}
                    </span>
                    <span className="text-gray-600 ml-1">({reviewCount} Đánh giá)</span>
                    <span className="mx-2">|</span>
                    <button className="text-gray-600 hover:text-gray-800 text-xs underline cursor-pointer">
                        Gửi bình luận của bạn
                    </button>
                </div>

                {/* Giá */}
                <div className="my-4">
                    <span className="text-3xl font-bold text-red-600">
                        GNY: {parseFloat(product.price).toLocaleString('vi-VN')} Đ
                    </span>
                </div>

                {/* Mô tả ngắn */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {product.description}
                </p>

                {/* Size & Màu sắc */}
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

                {/* Số lượng */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-12 text-center border-none focus:ring-0"
                        />
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Nút thêm vào giỏ */}
                <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black flex-grow"
                >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Thêm vào giỏ hàng
                </Button>

                {/* Biểu tượng chia sẻ */}
                <div className="flex gap-2 mt-4">
                    <button className="flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        <FaFacebookF className="w-4 h-4 mr-1" />
                        Like
                    </button>
                    <button className="flex items-center px-2 py-1 bg-blue-400 text-white text-xs rounded">
                        <FaTwitter className="w-4 h-4 mr-1" />
                        Tweet
                    </button>
                    <button className="flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded">
                        <FaGooglePlusG className="w-4 h-4 mr-1" />
                        G+
                    </button>
                    <button className="flex items-center px-2 py-1 bg-red-500 text-white text-xs rounded">
                        <FaShareAlt className="w-4 h-4 mr-1" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
