'use client';

import React from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { Role } from '@/types/role';
import { useSession } from 'next-auth/react';
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const role = session?.user?.role;
    if (role === Role.CUSTOMER || !session) {
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
