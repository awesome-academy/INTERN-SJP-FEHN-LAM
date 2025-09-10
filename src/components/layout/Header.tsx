'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { Product } from '@/types';
import SearchResults from '../search/SearchResults';
import { searchProducts } from '@/services/products';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const handler = setTimeout(() => {
            const fetchResults = async () => {
                try {

                    const data = await searchProducts(searchQuery);
                    setSearchResults(data);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                }
            };

            fetchResults();
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (value: string) => {
        setSearchQuery(value);
        if (value.length >= 2) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?q=${value}&limit=5`);
                const data = await response.json();
                setSearchResults(data);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
        } else {
            router.push('/products');
        }
        setShowResults(false);
    };
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
                <div className="relative w-64" ref={searchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative w-64" >
                        <Input
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="pr-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
                        >
                            <FiSearch size={18} />
                        </Button>
                        <SearchResults
                            products={searchResults}
                            visible={showResults}
                            onClose={() => setShowResults(false)}
                        />
                    </form>
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
                    <ThemeSwitcher />
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
        <header className="bg-card text-card-foreground border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <HeaderTop isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <HeaderMain />
            </div>
        </header>
    );
};

export default Header;
