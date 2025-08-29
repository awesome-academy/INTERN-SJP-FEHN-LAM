'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login as loginService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/role';
import { Checkbox } from "@/components/ui/checkbox";
import CustomBreadcrumb from '@/components/breadcumb/CustomBreadcrumb';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login: updateAuthState } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {

            const data = await loginService(email, password);
            updateAuthState({
                token: data.accessToken,
                role: data.user.role,
                id: data.user.id,
            });
            toast.success('Đăng nhập thành công!');

            if (data.user.role === Role.ADMIN) {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 mb-[200px]">
            <div className="py-4 text-sm text-gray-500">
                <CustomBreadcrumb
                    items={[
                        { label: "Trang chủ" },
                        { label: "Đăng nhập", href: "/login" },

                    ]}
                />
            </div >

            <main className="pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-32">
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            THÔNG TIN ĐĂNG NHẬP:
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email: <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Mật khẩu: <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                                        Ghi nhớ đăng nhập
                                    </Label>
                                </div>

                                <Link
                                    href="/forgot-password"
                                    className="text-sm underline text-yellow-500 hover:text-yellow-600"
                                >
                                    Bạn quên mật khẩu?
                                </Link>
                            </div >

                            <Button
                                type="submit"
                                className="w-full max-w-xs mt-2"
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form >
                    </div >
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            BẠN CHƯA CÓ TÀI KHOẢN?
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Đăng ký tài khoản để mua hàng nhanh hơn. Theo dõi đơn đặt hàng, vận chuyển.
                            Cập nhật các tin tức, sự kiện và các chương trình giảm giá của chúng tôi.
                        </p>
                        <Link
                            href="/register"
                            className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            → Đăng ký ngay
                        </Link>
                    </div>
                </div >
            </main >
        </div >
    );
}
