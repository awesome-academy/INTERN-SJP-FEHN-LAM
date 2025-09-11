'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserById, updateUser } from '@/services/users';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types';
import { useSession } from 'next-auth/react';

const profileSchema = z.object({
    username: z.string().min(2, "Họ và tên phải ít nhất 2 ký tự"),
    phone: z.string().min(10, "Số điện thoại phải ít nhất 10 ký tự"),
    address: z.string().min(5, "Địa chỉ phải ít nhất 5 ký tự")
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    const userId = session?.user?.id;
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: '',
            phone: '',
            address: ''
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session) {
                router.push('/login');
                return;
            }

            if (userId) {
                try {
                    const userData = await getUserById(userId);
                    setUser(userData);
                    reset({
                        username: userData.username || '',
                        phone: userData.phone || '',
                        address: userData.address || ''
                    });
                } catch (error) {
                    toast.error('Không thể tải thông tin người dùng');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [session, userId, router]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            if (userId) {
                await updateUser(userId, data);
                toast.success('Cập nhật thông tin thành công!');
                reset(data);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                                <CardDescription>
                                    Quản lý thông tin tài khoản của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-600">
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold">{user?.username || 'Người dùng'}</h3>
                                        <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                                    </div>

                                    <nav className="space-y-2">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium"
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            href="/profile/orders"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                        >
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link
                                            href="/profile/change-password"
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                        >
                                            Đổi mật khẩu
                                        </Link>
                                    </nav>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                                <CardDescription>
                                    Cập nhật thông tin cá nhân của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            {errors.username && (
                                                <span className="text-sm text-red-500 mt-1">{errors.username.message}</span>
                                            )}
                                            <Label htmlFor="username">Họ và tên</Label>
                                            <Input
                                                id="username"
                                                {...register('username')}
                                                className={errors.username ? 'border-red-500' : ''}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={user?.email}
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                                        </div>

                                        <div className="space-y-2">
                                            {errors.phone && (
                                                <span className="text-sm text-red-500 mt-1">{errors.phone.message}</span>
                                            )}
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input
                                                id="phone"
                                                {...register('phone')}
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            {errors.address && (
                                                <span className="text-sm text-red-500 mt-1">{errors.address.message}</span>
                                            )}
                                            <Label htmlFor="address">Địa chỉ</Label>
                                            <Input
                                                id="address"
                                                {...register('address')}
                                                className={errors.address ? 'border-red-500' : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button type="button" variant="outline">
                                            Hủy
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
