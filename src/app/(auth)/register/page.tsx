'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register as authServiceRegister } from '@/services/authService';
import CustomBreadcrumb from '@/components/breadcumb/CustomBreadcrumb';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { registrationSchema, RegistrationData } from '@/schema/authSchema';


export default function RegisterPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<RegistrationData>({
        resolver: zodResolver(registrationSchema)
    });
    const onSubmit = async (data: RegistrationData) => {
        setError('');
        setLoading(true);

        try {
            const result = await authServiceRegister({
                id: 0,
                username: data.username,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phone: data.phone,
                address: data.address,
            });

            toast.success(result.message || "Vui lòng kiểm tra email để xác nhận tài khoản!");
            reset();

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
                <form onSubmit={handleSubmit(onSubmit)}>
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
                                <Label htmlFor="username">Họ và tên: <span className="text-red-500">*</span></Label>
                                {errors.username && (
                                    <span className="text-sm text-red-500 mt-1">{errors.username.message}</span>
                                )}
                                <Input id="username" type="text" {...register('username')} className={errors.username ? 'border-red-500' : ''} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Số điện thoại: <span className="text-red-500">*</span></Label>
                                {errors.phone && (
                                    <span className='text-sm text-red-500 mb-1'>{errors.phone.message}</span>
                                )}
                                <Input id="phone" type="tel" {...register('phone')} className={errors.phone ? 'border-red-500' : ''} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="personal-email">Email: <span className="text-red-500">*</span></Label>
                                {errors.email && (
                                    <span className='text-sm text-red-500 mb-1'>{errors.email.message}</span>
                                )}
                                <Input id="personal-email" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Địa chỉ: <span className="text-red-500">*</span></Label>
                                {errors.address && (
                                    <span className='text-sm text-red-500 mb-1'>{errors.address.message}</span>
                                )}
                                <Input id="address" type="text" {...register('address')} className={errors.address ? 'border-red-500' : ''} />
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
                                {errors.password && (
                                    <span className='text-sm text-red-500 mb-1'>{errors.password.message}</span>
                                )}
                                <Input id="password" type="password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu: <span className="text-red-500">*</span></Label>
                                {errors.confirmPassword && (
                                    <span className='text-sm text-red-500 mb-1'>{errors.confirmPassword.message}</span>
                                )}
                                <Input id="confirm-password" type="password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500' : ''} />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-8" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                    </Button>
                </form>
            </main>
        </div>
    );
}
