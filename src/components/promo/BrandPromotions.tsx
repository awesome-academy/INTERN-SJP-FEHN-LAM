import React from 'react';
import PromoCard from './PromoCard';

const BrandPromotions = () => {
    const promoData = [
        {
            brand: 'DEMISHI',
            productType: 'MÁY HÀN XÌ CHUYÊN NGHIỆP',
            price: '2.250.000 Đ',
            promoText: 'CƠ HỘI TRÚNG NGAY TIVI SAMSUNG LCD',
            promoValue: 'TRỊ GIÁ 2.700.000 Đ',
            imageUrl: '/images/products/demishi-drill.png',
            imageAlt: 'Demishi Drill'
        },
        {
            brand: 'MAKITA',
            productType: 'MÁY KHOAN - CẮT ĐA NĂNG',
            price: '7.450.000 Đ',
            promoText: 'TẶNG NGAY 1 BỘ PHỤ KIỆN CAO CẤP',
            promoValue: 'TRỊ GIÁ 500.000 Đ',
            imageUrl: '/images/products/makita-saw.png',
            imageAlt: 'Makita Saw'
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promoData.map(promo => <PromoCard key={promo.brand} {...promo} />)}
            </div>
        </section>
    );
};

export default BrandPromotions;
