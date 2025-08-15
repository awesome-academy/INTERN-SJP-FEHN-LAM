'use client';

import React from 'react';
import { FaGooglePlusG, FaTwitter } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { Input } from "@/components/ui/input";
const Header = () => {
    return (
        <header className="bg-white">
            <div className="max-w-[1600px] mx-auto px-8ml [100px]">
                <div className="flex justify-between items-center pt-4 pb-2 ">
                    <div className="flex items-center gap-4 text-gray-500 ml-[80px]">
                        <a href="#" className="hover:text-black">
                            <FaGooglePlusG size={20} />
                        </a>
                        <a href="#" className="hover:text-black">
                            <FaTwitter size={18} />
                        </a>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold uppercase text-gray-700">
                        <a href="#" className="hover:text-yellow-600">Đăng ký</a>
                        <a href="#" className="hover:text-yellow-600">Đăng nhập</a>
                    </div>
                </div>


                <div className="flex justify-between items-center pt-3">
                    <div className="flex-shrink-0">
                        <a href="/">
                            <img src="/images/logo-thanh-cong.png" alt="Thanh Cong Logo" className="h-35 w-auto" />
                        </a>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-6 text-base">
                        <div className="text-gray-500">
                            <span className="font-semibold text-[#e5b642]">HOTLINE :</span>
                            <br />
                            <span>(04).9530 9669 - (04).9530 0850</span>
                        </div>
                        <div className="text-gray-500 ml-[100px]">
                            <span className="font-semibold text-[#e5b642]">ĐẶT HÀNG NHANH:</span>
                            <br />
                            (04).9530 9669 - (04).9530 0850
                        </div>
                    </div>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-52 pr-8"
                        />
                        <button className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
                            <FiSearch />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
