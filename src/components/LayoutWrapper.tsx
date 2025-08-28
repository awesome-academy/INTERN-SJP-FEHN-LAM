'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { Role } from '@/types/role';
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { role } = useAuth();

    if (role === Role.CUSTOMER || role === null) {
        return (
            <>
                <Header />
                <main>{children}</main>
                <Footer />
            </>
        );
    }

    return <main>{children}</main>;
};

export default LayoutWrapper;
