"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/services/upload';

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

    const handleSave = async (data: Partial<Product> & { imageFile?: File | null }) => {
        try {

            let imageUrl = editingProduct?.image_url || '';

            if (data.imageFile) {
                const result = await uploadImage(data.imageFile);

                if (!result.success || !result.url) {
                    toast.error('Tải ảnh lên thất bại!');
                    throw new Error(result.error || 'Image upload failed');
                }

                imageUrl = result.url;
            }
            const finalProductData = {
                ...data,
                image_url: imageUrl,
            };
            delete finalProductData.imageFile;
            if (editingProduct) {
                await updateProduct(editingProduct.id, finalProductData);
                toast.success('Cập nhật sản phẩm thành công!');
            } else {
                await createProduct(finalProductData as Omit<Product, 'id'>);
                toast.success('Thêm sản phẩm thành công!');
            }

            refreshData();
        } catch (error) {
            const action = editingProduct ? 'cập nhật' : 'thêm';
            toast.error(`Không thể ${action} sản phẩm.`);
            console.error(error);
        } finally {
            setIsCreating(false);
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

    const handlePageChange = (page: number) => {
        router.push(`/admin/products?page=${page}`);
    };

    if (isLoading) {
        return <div>Đang tải danh sách sản phẩm...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
                <Button onClick={() => { setIsCreating(true); setEditingProduct(null); }}>
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
                                <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                                <TableCell>
                                    <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                                        {product.stock_quantity}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setProductToDelete(product.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

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
                onSave={handleSave}
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
