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

interface UserCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (userData: Omit<User, 'id'>) => void;
}

export function UserCreateDialog({ isOpen, onClose, onUserCreated }: UserCreateDialogProps) {
    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        username: '',
        email: '',
        role: 'CUSTOMER',
        status: 'active',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field: 'role' | 'status') => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            onUserCreated(formData);
            setFormData({
                username: '',
                email: '',
                role: 'CUSTOMER',
                status: 'active',
                password: '',
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

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className="text-sm font-medium">Tên</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-sm font-medium">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                    required
                                />
                            </div>
                        </div>


                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="role" className="text-sm font-medium">Vai trò</Label>
                                <Select
                                    onValueChange={handleSelectChange('role')}
                                    value={formData.role}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                                <Select
                                    onValueChange={handleSelectChange('status')}
                                    value={formData.status}
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
                        <Button type="submit">Tạo người dùng</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
