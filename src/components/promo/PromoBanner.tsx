import React from 'react';
import Image from 'next/image';
import tools from '@/assets/images/tools.png';
import { Button } from '@/components/ui/button';
const PromoBanner = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-secondary rounded-lg flex flex-col md:flex-row items-center p-8 overflow-hidden">
                <div className="w-full md:w-1/2 relative h-56 mb-6 md:mb-0 flex justify-center">
                    <Image
                        src={tools}
                        alt="Tools Banner"
                        width={400}
                        height={300}
                        className="object-contain"
                    />
                </div>

                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800">
                        ROCKET WOKARU
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-sm mx-auto md:mx-0">
                        Máy cắt, khoan đa năng tích hợp điều khiển từ xa loại nhỏ thích hợp
                        với các hộ gia đình
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                        <Button
                            className="bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                        >
                            MUA NGAY
                        </Button>
                        <Button
                            variant="outline"
                            className="text-gray-700 border-gray-400 hover:bg-gray-200 transition-colors"
                        >
                            CHI TIẾT
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoBanner;
