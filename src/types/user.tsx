import { Role } from "./role";
import { Status } from "./status";

export interface User {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    phone?: string;
    address?: string;
    role: Role;
    status: Status;
    password?: string;
}
