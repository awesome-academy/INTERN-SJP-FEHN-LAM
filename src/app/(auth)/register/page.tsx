'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { register } from '@/services/authService';
import CustomBreadcrumb from '@/components/breadcumb/CustomBreadcrumb';

export default function RegisterPage() {
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register({
                name: fullname,
                email,
                password,
                confirmPassword,
                phone,
                address,
            });

            toast.success(result.message || "Vui lòng kiểm tra email để xác nhận tài khoản!");

        } catch (err: any) {
            const errorMessage = err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-4">
            <div className="py-8 text-sm text-gray-500">
                <CustomBreadcrumb
                    items={[
                        { label: "Đăng nhập", href: "/login" },
                        { label: "Đăng kí" },
                    ]}
                />
            </div>

            <main className="pb-16">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="mb-12">
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            THÔNG TIN CÁ NHÂN:
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Họ và tên: <span className="text-red-500">*</span></Label>
                                <Input id="fullname" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại: <span className="text-red-500">*</span></Label>
                                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="personal-email">Email: <span className="text-red-500">*</span></Label>
                                <Input id="personal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa chỉ: <span className="text-red-500">*</span></Label>
                                <Input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-6">
                            <input type="checkbox" id="newsletter" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                            <Label htmlFor="newsletter" className="text-sm font-normal text-gray-600 cursor-pointer">
                                Đăng kí nhận tin tức qua email
                            </Label>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            THÔNG TIN ĐĂNG NHẬP:
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu: <span className="text-red-500">*</span></Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu: <span className="text-red-500">*</span></Label>
                                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-8" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                </form>
            </main>
        </div>
    );
}
