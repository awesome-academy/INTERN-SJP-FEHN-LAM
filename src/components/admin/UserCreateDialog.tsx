"use client";

import { useState } from 'react';
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
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@/types/role';
import { UserCreateFormData, userCreateSchema } from '@/schema/userSchema';
import { Status } from '@/types/status';
interface UserCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (userData: Omit<User, 'id'>) => void;
}
export function UserCreateDialog({ isOpen, onClose, onUserCreated }: UserCreateDialogProps) {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<UserCreateFormData>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            username: '',
            email: '',
            role: Role.CUSTOMER,
            status: Status.ACTIVE,
            phone: ''
        }
    });

    const onSubmit = async (data: UserCreateFormData) => {
        setLoading(true);
        try {
            onUserCreated(data);
            reset({
                username: '',
                email: '',
                role: Role.CUSTOMER,
                status: Status.ACTIVE,
                phone: '',
                address: '',
            });
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi tạo người dùng.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Thêm người dùng mới</DialogTitle>
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
                                    required
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
                                    required
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
                                        <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
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
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="inactive">Bị khóa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Hủy</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? 'Đang tạo...' : 'Tạo người dùng'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
