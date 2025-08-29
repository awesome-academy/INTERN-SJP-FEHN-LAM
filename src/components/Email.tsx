
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { activateAccount } from '@/services/authService';

export default function VerifyEmailPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setMessage('Token không hợp lệ hoặc đã bị thiếu.');
                setLoading(false);
                return;
            }

            try {
                const data = await activateAccount(token);

                setMessage(data.message);
                toast.success(data.message || 'Kích hoạt thành công!');
                router.push('/login');
            } catch (error: any) {
                const errorMessage = error.message || 'Có lỗi xảy ra khi xác nhận email';
                setMessage(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-600">Đang xác nhận email của bạn...</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-lg mb-6 text-gray-800">{message}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
                        >
                            Về trang đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
