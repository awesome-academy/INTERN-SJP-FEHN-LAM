'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LoginData {
    token: string;
    role: string;
}

interface AuthContextType {
    isLoggedIn: boolean | null;
    role: string | null;
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

    const checkAuthStatus = () => {
        const token = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("role");
        setIsLoggedIn(!!token);
        if (token && userRole) {
            setRole(userRole);
        } else {
            setRole(null);
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
        setIsLoggedIn(true);
        setRole(data.role);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
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
