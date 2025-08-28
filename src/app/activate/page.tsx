'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { activateAccount } from '@/services/authService';

export default function ActivatePage() {
    const [message, setMessage] = useState('Đang kích hoạt tài khoản...');
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setMessage('Token không hợp lệ');
                toast.error('Token không hợp lệ');
                return;
            }

            try {
                const data = await activateAccount(token);
                setMessage(data.message);
                toast.success(data.message || 'Kích hoạt thành công!');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (error) {
                setMessage('Có lỗi xảy ra');
                toast.error('Có lỗi xảy ra');
            }
        };

        verifyToken();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-lg">{message}</p>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Về trang đăng nhập
                </button>
            </div>
        </div>
    );
}
