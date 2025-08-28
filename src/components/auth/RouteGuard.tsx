'use client';

import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/role';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type RouteGroup = {
    paths: string[];
    roles?: Role[];
    redirect: (role: Role) => string;
};

const protectedRoutes: Record<'admin' | 'customer' | 'guest', RouteGroup> = {
    admin: {
        paths: ['/admin'],
        roles: [Role.ADMIN],
        redirect: () => '/',
    },
    customer: {
        paths: ['/profile', '/orders', '/checkout'],
        roles: [Role.CUSTOMER],
        redirect: () => '/',
    },
    guest: {
        paths: ['/login', '/register'],
        redirect: (role) => (role === Role.ADMIN ? '/admin/dashboard' : '/'),
    },
};

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, role } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (isLoggedIn === null) return;

        const userRole: Role = isLoggedIn ? (role as Role) : Role.GUEST;

        const matchedGroup = Object.values(protectedRoutes).find((group) =>
            group.paths.some((path) => pathname.startsWith(path))
        );
        if (matchedGroup) {
            if (!matchedGroup.roles && isLoggedIn) {
                router.replace(matchedGroup.redirect(userRole));
                return;
            }
            if (matchedGroup.roles && !matchedGroup.roles.includes(userRole)) {
                router.replace(matchedGroup.redirect(userRole));
                return;
            }
        }

        setIsVerified(true);
    }, [isLoggedIn, role, pathname, router]);

    if (!isVerified) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return <>{children}</>;
}
