export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    role: 'user' | 'admin';
}
