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
import { updateUser } from '@/services/api';

interface UserEditDialogProps {
    user: User | null;
    onClose: () => void;
    onUserUpdated: (userData: Partial<User>) => void;
}

export function UserEditDialog({ user, onClose, onUserUpdated }: UserEditDialogProps) {
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
            });
        }
    }, [user]);

    if (!user) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (field: 'role' | 'status') => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            await updateUser(user.id, formData);
            onUserUpdated(formData);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi cập nhật.');
        }
    };

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">Tên</Label>
                        <Input
                            id="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Vai trò</Label>
                        <Select
                            onValueChange={handleSelectChange('role')}
                            value={formData.role || ''}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Trạng thái</Label>
                        <Select
                            onValueChange={handleSelectChange('status')}
                            value={formData.status || ''}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Bị khóa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Hủy</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
