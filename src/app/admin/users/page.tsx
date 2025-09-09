"use client";
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAllUsers, deleteUser, updateUser, createUser } from '@/services/users';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CustomPagination } from '@/components/Pagination';
import { User } from '@/types';
import { UserEditDialog } from '@/components/admin/UserEditDialog';
import { UserCreateDialog } from '@/components/admin/UserCreateDialog';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';
import { toast } from 'react-toastify';

export default function UsersPage() {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [creatingUser, setCreatingUser] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | string | null>(null);

    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(allUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = allUsers.slice(startIndex, startIndex + itemsPerPage);

    const refreshUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setAllUsers(data || []);
        } catch (error) {
            toast.error('Không thể làm mới danh sách người dùng');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    const handleConfirmRemove = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete);
            toast.success('Đã xóa người dùng thành công');
            refreshUsers();
        } catch (err) {
            toast.error('Không thể xóa người dùng');
        } finally {
            setUserToDelete(null);
            setConfirmOpen(false);
        }
    };

    const handleUpdateUser = async (userData: Partial<User>) => {
        if (!editingUser) return;
        try {
            await updateUser(editingUser.id, userData);
            toast.success('Cập nhật người dùng thành công');
            refreshUsers();
        } catch (error) {
            toast.error('Không thể cập nhật người dùng');
        } finally {
            setEditingUser(null);
        }
    };

    const handleCreateUser = async (userData: Omit<User, 'id'>) => {
        try {
            await createUser(userData);
            toast.success('Tạo người dùng thành công');
            refreshUsers();
        } catch (error) {
            toast.error('Không thể tạo người dùng');
        } finally {
            setCreatingUser(false);
        }
    };

    const handleDeleteUser = (id: number | string) => {
        setUserToDelete(id);
        setConfirmOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user)
    };

    if (isLoading) {
        return <div>Đang tải toàn bộ danh sách người dùng...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <Button onClick={() => setCreatingUser(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm người dùng
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên khách hàng</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isActivate ? 'default' : 'destructive'}>
                                        {user.isActivate ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => handleEditUser(user)} className='cursor-pointer'>
                                        <Edit className="h-3 w-3" /> Sửa
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)} className='cursor-pointer'>
                                        <Trash2 className="h-3 w-3" /> Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {
                totalPages > 1 && (
                    <CustomPagination
                        total={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )
            }

            <UserCreateDialog
                isOpen={creatingUser}
                onClose={() => setCreatingUser(false)}
                onUserCreated={handleCreateUser}
            />
            <UserEditDialog
                user={editingUser}
                onClose={() => setEditingUser(null)}
                onUserUpdated={handleUpdateUser}
            />
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Xác nhận xóa Người dùng"
                description="Bạn có chắc muốn xóa người dùng này?"
            />
        </div >
    );
}
