import { User } from "@/types";
import { API_BASE, fetcher } from "./api";

export const getUsers = async (params?: { page?: number; limit?: number }) => {
    const { page = 1, limit = 10 } = params || {};
    const response = await fetch(`/api/users?_page=${page}&_limit=${limit}`);

    if (!response.ok) throw new Error("Không thể lấy danh sách người dùng");

    const data = await response.json();
    const totalCount = parseInt(response.headers.get("X-Total-Count") || "0", 10);
    return { data, totalCount };
};

export const getUserById = (userId: number | string) =>
    fetcher(`${API_BASE}/users/${userId}`);

export const createUser = async (userData: Omit<User, "id">) => {
    const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Không thể tạo người dùng");
    return response.json();
};

export const updateUser = async (
    id: string | number,
    userData: Partial<User>
) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Không thể cập nhật người dùng");
    return response.json();
};

export const deleteUser = async (id: string | number) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Không thể xóa người dùng");
    return response.json();
};

export const getAllUsers = async () => {
    const response = await fetch(`/api/users`);
    if (!response.ok) throw new Error("Không thể lấy danh sách người dùng");
    return response.json();
};
