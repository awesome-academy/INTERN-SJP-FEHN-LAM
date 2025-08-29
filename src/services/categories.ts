import { apiClient } from "./api";
import { Category } from '@/types/category';

export const getCategories = () => apiClient<Category[]>('/categories');

export const getCategoryById = (id: string | number) => apiClient<Category>(`/categories/${id}`);

export const createCategory = (categoryData: Omit<Category, 'id'>) => {
    return apiClient<Category>('/categories', {
        method: 'POST',
        body: categoryData,
    });
};

export const updateCategory = (id: string | number, categoryData: Partial<Category>) => {
    return apiClient<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: categoryData,
    });
};

export const deleteCategory = (id: string | number) => {
    return apiClient(`/categories/${id}`, {
        method: 'DELETE',
    });
};
