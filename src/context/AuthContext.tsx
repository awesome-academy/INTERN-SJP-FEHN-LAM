'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LoginData {
    token: string;
    role: string;
    id: number | string;
}

interface AuthContextType {
    isLoggedIn: boolean | null;
    role: string | null;
    userId: number | string | null;
    login: (data: LoginData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | string | null>(null);

    const checkAuthStatus = () => {
        const token = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("role");
        const storedUserId = localStorage.getItem("userId");

        setIsLoggedIn(!!token);

        if (token && userRole && storedUserId) {
            setRole(userRole);
            setUserId(storedUserId);
        } else {
            setRole(null);
            setUserId(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();
        window.addEventListener('storage', checkAuthStatus);
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const login = (data: LoginData) => {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id.toString());

        setIsLoggedIn(true);
        setRole(data.role);
        setUserId(data.id)
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        setIsLoggedIn(false);
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
