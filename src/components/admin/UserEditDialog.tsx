"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from '@/types';
import { updateUser } from '@/services/users';
import { Role } from '@/types/role';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserUpdateFormData, userUpdateSchema } from '@/schema/userSchema';
import { Status } from '@/types/status';
interface UserEditDialogProps {
    user: User | null;
    onClose: () => void;
    onUserUpdated: (userData: Partial<User>) => void;
}
export function UserEditDialog({ user, onClose, onUserUpdated }: UserEditDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UserUpdateFormData>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            username: '',
            email: '',
            role: Role.CUSTOMER,
            status: Status.ACTIVE,
            phone: ''
        }
    });
    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                status: user.status,
            });
        }
    }, [user]);

    if (!user) return null;

    const onSubmit = async (data: UserUpdateFormData) => {
        try {
            await updateUser(user.id, data);
            onUserUpdated(data);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi cập nhật.');
        }
    };

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className="text-sm font-medium">Họ và tên</Label>
                                <Input
                                    id="username"
                                    {...register('username')}
                                    className={`mt-1 ${errors.username ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.username && (
                                    <span className="text-sm text-red-500">{errors.username.message}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.email && (
                                    <span className="text-sm text-red-500">{errors.email.message}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...register('phone')}
                                    className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                                />
                                {errors.phone && (
                                    <span className="text-sm text-red-500">{errors.phone.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="address" className="text-sm font-medium">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    {...register('address')}
                                    className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                                />
                                {errors.address && (
                                    <span className="text-sm text-red-500">{errors.address.message}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-sm font-medium">Vai trò</Label>
                                <Select
                                    {...register('role')}
                                >
                                    <SelectTrigger className={`mt-1 ${errors.role ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Role.CUSTOMER}>CUSTOMER</SelectItem>
                                        <SelectItem value={Role.ADMIN}>ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <span className="text-sm text-red-500">{errors.role.message}</span>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                                <Select
                                    {...register('status')}
                                >
                                    <SelectTrigger className={`mt-1 ${errors.status ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="block">Bị khóa</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <span className="text-sm text-red-500">{errors.status.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Hủy</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
