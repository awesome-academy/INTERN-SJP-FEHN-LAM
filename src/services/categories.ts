import { Category } from "@/types/category";
import { API_BASE, fetcher } from "./api";

export const getCategories = () => fetcher("/api/categories");
export const getCategoryById = (id: string | number) =>
    fetcher(`/categories/${id}`);

export const createCategory = async (categoryData: Omit<Category, "id">) => {
    const response = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error("Không thể tạo danh mục");
    return response.json();
};

export const updateCategory = async (
    id: string | number,
    categoryData: Partial<Category>
) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error("Không thể cập nhật danh mục");
    return response.json();
};

export const deleteCategory = async (id: string | number) => {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Không thể xóa danh mục");
    return response.json();
};
