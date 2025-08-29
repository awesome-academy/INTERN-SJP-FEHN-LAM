import { apiClient } from "./api";
import { User } from '@/types/user';

export const getUsers = async (params?: { page?: number; limit?: number }) => {
    const { page = 1, limit = 10 } = params || {};
    const data = await apiClient<User[]>(`/users?_page=${page}&_limit=${limit}`);
    return { data };
};


export const getAllUsers = async () => {
    return await apiClient<User[]>('/users');
};


export const getUserById = async (userId: number | string) => {
    return await apiClient<User>(`/users/${userId}`);
};


export const createUser = async (userData: Omit<User, "id">) => {
    return await apiClient<User>('/users', {
        method: 'POST',
        body: userData,
    });
};

export const updateUser = async (id: string | number, userData: Partial<User>) => {
    return await apiClient<User>(`/users/${id}`, {
        method: 'PATCH',
        body: userData,
    });
};
export const deleteUser = (id: string | number) => {
    return apiClient(`/users/${id}`, {
        method: 'DELETE',
    });
};
