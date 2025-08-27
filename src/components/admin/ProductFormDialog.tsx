"use client";

import { useState, useEffect } from "react";
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
import { Product } from "@/types";
import { Category } from "@/types/category";

interface ProductFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Partial<Product> & { imageFile?: File | null }) => void;
    product?: Product | null;
    categories: Category[];
}

export function ProductFormDialog({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
}: ProductFormDialogProps) {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (product && isOpen) {
            setFormData({
                product_name: product.product_name || "",
                price: product.price ?? 0,
                stock_quantity: product.stock_quantity ?? 0,
                description: product.description || "",
                categoryId: product.categoryId ?? undefined,
                image_url: product.image_url || "",
            });
            setImageFile(null);
        } else {
            setFormData({});
            setImageFile(null);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;

        setFormData((prev) => {
            if (id === "price" || id === "stock_quantity") {
                return { ...prev, [id]: value === "" ? undefined : Number(value) };
            }
            return { ...prev, [id]: value };
        });
    };
    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            categoryId: value === "" ? undefined : Number(value),
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        onSave({ ...formData, imageFile });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="product_name" className="text-right">
                            Tên SP
                        </Label>
                        <Input
                            id="product_name"
                            value={formData.product_name || ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Giá
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price ?? ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock_quantity" className="text-right">
                            Tồn kho
                        </Label>
                        <Input
                            id="stock_quantity"
                            type="number"
                            value={formData.stock_quantity ?? ""}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoryId" className="text-right">
                            Danh mục
                        </Label>
                        <Select
                            onValueChange={handleCategoryChange}
                            value={formData.categoryId ? String(formData.categoryId) : ""}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Chọn danh mục..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.category_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageFile" className="text-right">
                            Ảnh sản phẩm
                        </Label>
                        <Input
                            id="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right mt-2">
                            Mô tả
                        </Label>
                        <textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            className="col-span-3 border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Hủy
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
