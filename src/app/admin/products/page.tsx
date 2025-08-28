"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { CustomPagination } from '@/components/Pagination';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/products';
import { getCategories } from '@/services/categories';
import { Product } from '@/types';
import { Category } from '@/types/category';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog';
import { ProductFormDialog } from '@/components/admin/ProductFormDialog';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | number | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 10;

    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    const currentProducts = allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setAllProducts(productsData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            toast.error('Không thể tải dữ liệu.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleCreate = async (productData: Partial<Product>) => {
        try {
            await createProduct(productData as Omit<Product, 'id'>);
            toast.success('Thêm sản phẩm thành công!');
            refreshData();
        } catch (error) {
            toast.error('Không thể thêm sản phẩm.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdate = async (productData: Partial<Product>) => {
        if (!editingProduct) return;
        try {
            await updateProduct(editingProduct.id, productData);
            toast.success('Cập nhật sản phẩm thành công!');
            refreshData();
        } catch (error) {
            toast.error('Không thể cập nhật sản phẩm.');
        } finally {
            setEditingProduct(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await deleteProduct(productToDelete);
            toast.success('Xóa sản phẩm thành công!');
            refreshData();
        } catch (error) {
            toast.error('Không thể xóa sản phẩm.');
        } finally {
            setProductToDelete(null);
        }
    };

    // ✅ Hàm xử lý khi người dùng đổi trang
    const handlePageChange = (page: number) => {
        router.push(`?page=${page}`);
    };

    if (isLoading) {
        return <div>Đang tải danh sách sản phẩm...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
                <Button onClick={() => setIsCreating(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm sản phẩm
                </Button>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Hình ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Tồn kho</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image
                                        src={product.image_url || '/placeholder.png'}
                                        alt={product.product_name}
                                        width={64} height={64}
                                        className="rounded-md object-cover"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.product_name}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>
                                    <Badge variant={product.stock_quantity > 0 ? 'outline' : 'destructive'}>
                                        {product.stock_quantity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setProductToDelete(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ✅ Dùng component mới thay cho đoạn phân trang cũ */}
            {totalPages > 1 && (
                <CustomPagination
                    total={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            )}

            <ProductFormDialog
                isOpen={isCreating || !!editingProduct}
                onClose={() => { setIsCreating(false); setEditingProduct(null); }}
                onSave={editingProduct ? handleUpdate : handleCreate}
                product={editingProduct}
                categories={categories}
            />

            <ConfirmDialog
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa Sản phẩm"
                description="Bạn có chắc muốn xóa sản phẩm này không?"
            />
        </div>
    );
}
