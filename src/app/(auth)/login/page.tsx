'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Role } from '@/types/role';
import { Checkbox } from "@/components/ui/checkbox";
import CustomBreadcrumb from '@/components/breadcumb/CustomBreadcrumb';
import { signIn, useSession } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const role = session?.user?.role;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else if (result?.ok) {
            toast.success('Đăng nhập thành công!');
            router.push("/")
        }
    };
    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();

            const result = await signInWithPopup(auth, provider);


            const idToken = await result.user.getIdToken();


            const signInResult = await signIn('firebase', {
                idToken,
                redirect: false,
            });

            if (signInResult?.error) {
                toast.error("Đăng nhập thất bại, email chưa đăng ký tài khoản");
            } else if (signInResult?.ok) {
                toast.success('Đăng nhập thành công!');
                router.push("/");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Google: ", error);
            toast.error("Có lỗi xảy ra trong quá trình đăng nhập.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 mb-[200px]">
            <div className="py-4 text-sm text-gray-500">
                <CustomBreadcrumb
                    items={[
                        { label: "Trang chủ" },
                        { label: "Đăng nhập", href: "/login" },

                    ]}
                />
            </div >

            <main className="pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-32">
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            THÔNG TIN ĐĂNG NHẬP:
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email: <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Mật khẩu: <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="text-sm font-normal text-gray-600">
                                        Ghi nhớ đăng nhập
                                    </Label>
                                </div>

                                <Link
                                    href="/forgot-password"
                                    className="text-sm underline text-yellow-500 hover:text-yellow-600"
                                >
                                    Bạn quên mật khẩu?
                                </Link>
                            </div >

                            <Button
                                type="submit"
                                className="w-full mt-2 cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form >
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Hoặc tiếp tục với
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full cursor-pointer"
                            onClick={() => handleGoogleSignIn()}
                            disabled={loading}
                        >
                            <FaGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div >
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider mb-8">
                            BẠN CHƯA CÓ TÀI KHOẢN?
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Đăng ký tài khoản để mua hàng nhanh hơn. Theo dõi đơn đặt hàng, vận chuyển.
                            Cập nhật các tin tức, sự kiện và các chương trình giảm giá của chúng tôi.
                        </p>
                        <Link
                            href="/register"
                            className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            → Đăng ký ngay
                        </Link>
                    </div>
                </div >
            </main >
        </div >
    );
}
