'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { FaGooglePlusG, FaTwitter, FaShoppingCart, FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAuth } from '@/context/AuthContext';
import logo from "@/assets/images/logo-thanh-cong.png";
interface HeaderTopProps {
    isLoggedIn: boolean | null;
    onLogout: () => void;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ isLoggedIn, onLogout }) => {
    return (
        <div className="flex justify-between items-center pt-4 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-4 text-gray-500">
                <a href="#" className="hover:text-black" aria-label="Google Plus">
                    <FaGooglePlusG size={20} />
                </a>
                <a href="#" className="hover:text-black" aria-label="Twitter">
                    <FaTwitter size={18} />
                </a>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold uppercase text-gray-700 h-5">
                {isLoggedIn === null ? (
                    <div className="w-40 h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : isLoggedIn ? (
                    <button onClick={onLogout} className="hover:text-yellow-600">Đăng xuất</button>
                ) : (
                    <>
                        <Link href="/login" className="hover:text-yellow-600">Đăng nhập</Link>
                        <Link href="/register" className="hover:text-yellow-600">Đăng ký</Link>
                    </>
                )}
            </div>
        </div>
    );
};

const HeaderMain: React.FC = () => {
    return (
        <div className="flex justify-between items-center py-3">
            <div className="flex-shrink-0">
                <Link href="/">
                    <Image
                        src={logo}
                        alt="Logo Thành Công"
                        width={150}
                        priority
                    />
                </Link>
            </div>


            <div className="hidden md:flex items-center gap-12 text-sm">
                <div className="text-gray-500">
                    <span className="font-semibold text-[#e5b642]">HOTLINE:</span>
                    <br />
                    <span>(04).9530 9669</span>
                </div>
                <div className="text-gray-500">
                    <span className="font-semibold text-[#e5b642]">ĐẶT HÀNG NHANH:</span>
                    <br />
                    <span>(04).9530 0850</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Input
                        type="search"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="pr-10"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                    >
                        <FiSearch size={18} />
                    </Button>
                </div>
                <div className="flex items-center gap-4">

                    <Link href="/cart" className="relative text-gray-700 hover:text-yellow-600">
                        <FaShoppingCart size={22} />
                        <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs rounded-full px-1.5">
                            3
                        </span>
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-yellow-600">
                        <FaUser size={22} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Header = () => {
    const router = useRouter();
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công");
        router.push('/');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <HeaderTop isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <HeaderMain />
            </div>
        </header>
    );
};

export default Header;
