"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";
import { getCategories, deleteCategory, updateCategory, createCategory } from "@/services/categories";
import { Category } from "@/types/category";
import { toast } from "react-toastify";
import CategoryModal from "@/components/admin/CategoryModal";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";

const CategoryItem = ({
    category,
    onEdit,
    onDelete,
}: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <span>{category.category_name}</span>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                <FilePenLine className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(category.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    </div>
);

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError("Không thể tải danh sách danh mục");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        setCategoryToDelete(id);
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            handleConfirmRemove();
        } else {
            setCategoryToDelete(null);
        }
    };
    const handleConfirmRemove = async () => {
        if (categoryToDelete === null) return;
        try {
            await deleteCategory(categoryToDelete);
            toast.success("Đã xóa danh mục thành công");
            fetchCategories();
        } catch (err) {
            toast.error("Không thể xóa danh mục");
            console.error(err);
        } finally {
            setCategoryToDelete(null);
        }
    };
    const handleSave = async (data: Omit<Category, "id">) => {
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
                toast.success("Cập nhật danh mục thành công");
            } else {
                await createCategory(data);
                toast.success("Thêm danh mục thành công");
            }
            setModalOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            toast.error("Không thể lưu danh mục");
            console.error(err);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setModalOpen(true);
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
                <Button onClick={handleAdd}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách danh mục</CardTitle>
                </CardHeader>
                <CardContent>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </CardContent>
            </Card>

            <CategoryModal
                open={modalOpen}
                category={editingCategory}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmRemove}
                title="Xác nhận xóa danh mục"
                description="Bạn có chắc chắn muốn xóa danh mục này??"
            />
        </div>

    );
}
