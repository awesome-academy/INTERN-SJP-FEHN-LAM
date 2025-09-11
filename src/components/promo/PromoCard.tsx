import React from 'react';
import Image from 'next/image';
import { PromoCardProps } from '@/types/PromoCardProps';

const PromoCard: React.FC<PromoCardProps> = ({ brand, productType, price, promoText, promoValue, imageUrl, imageAlt }) => {
    return (
        <div className="relative bg-secondary p-6 flex items-center justify-between overflow-hidden">
            <div className="flex-1">
                <h3 className="text-6xl font-bold text-gray-800">{brand}</h3>
                <p className="text-lg text-gray-500 uppercase mt-1">{productType}</p>
                <div className="inline-block bg-yellow-400 text-3xl text-black font-bold py-2 px-4 mt-4">
                    {price}
                </div>
                <div className="mt-2">
                    <p className="text-black text-base font-medium uppercase italic">{promoText}</p>
                    <p className="text-red-600 text-lg font-bold uppercase  italic">{promoValue}</p>
                </div>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center">
                <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={300}
                    height={300}
                    className="object-contain"
                />
            </div>
        </div>
    );
};

export default PromoCard;
