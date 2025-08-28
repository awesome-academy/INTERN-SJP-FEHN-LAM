"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryModalProps {
    category?: Category | null;
    open: boolean;
    onClose: () => void;
    onSave: (data: Omit<Category, "id">) => void;
}

export default function CategoryModal({ category, open, onClose, onSave }: CategoryModalProps) {
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (category) {
            setCategoryName(category.category_name);
            setDescription(category.description || "");
        } else {
            setCategoryName("");
            setDescription("");
        }
    }, [category, open]);

    if (!open) return null;

    const handleSave = () => {
        if (!categoryName.trim()) return;
        onSave({
            category_name: categoryName,
            description,
            created_at: category?.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-96 relative">
                <button className="absolute top-2 right-2" onClick={onClose}>
                    <X />
                </button>
                <h2 className="text-xl font-bold mb-4">
                    {category ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                </h2>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Tên danh mục</label>
                    <Input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Tên danh mục"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Mô tả</label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả danh mục"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave}>Lưu</Button>
                </div>
            </div>
        </div>
    );
}
