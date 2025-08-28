export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    role: 'CUSTOMER' | 'ADMIN';
    status: 'active' | 'block';
    password?: string;
}
