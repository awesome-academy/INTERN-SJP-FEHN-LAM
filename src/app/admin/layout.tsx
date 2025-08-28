import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    Box,
    Shapes,
    ShoppingCart,
    Search,
    Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const menuItems = [
        { name: 'Tổng quan', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Sản phẩm', href: '/admin/products', icon: Box },
        { name: 'Danh mục', href: '/admin/categories', icon: Shapes },
        { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Người dùng', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col gap-4 p-4">
                    <Link href="#" className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <span className="">Admin Panel</span>
                    </Link>

                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer">
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col sm:ml-64">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="pl-8 sm:w-1/2"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </header>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
