import { Role } from "./role";
export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    isActivate: boolean;
    address?: string;
    role: Role;
    password?: string;
}
