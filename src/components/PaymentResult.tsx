import React from 'react';
import Link from "next/link";
import SuccessIcon from './icons/SuccessIcon';
import ErrorIcon from './icons/ErrorIcon';

interface PaymentResultProps {
    status: 'success' | 'error';
    message: string;
    orderId?: string;
    amount?: string;
}

const PaymentResult: React.FC<PaymentResultProps> = ({ status, message, orderId, amount }) => {
    const formattedAmount = amount ? parseInt(amount) : undefined;

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10">
            <div className={`text-center mb-6 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {status === 'success' ? (
                    <SuccessIcon className="w-16 h-16 mx-auto mb-4" />
                ) : (
                    <ErrorIcon className="w-16 h-16 mx-auto mb-4" />
                )}

                <h2 className="text-2xl font-bold mb-2">
                    {status === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h2>
                <p className="text-gray-600">{message}</p>
            </div>

            {orderId && (
                <div className="mb-4 text-center">
                    <p className="text-gray-700">Mã đơn hàng: <span className="font-semibold">{orderId}</span></p>
                </div>
            )}

            {amount && (
                <div className="mb-6 text-center">
                    <p className="text-gray-700">
                        Số tiền: <span className="font-semibold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                .format(formattedAmount || 0)}
                        </span>
                    </p>
                </div>
            )}

            <div className="flex justify-center space-x-4">
                <Link
                    href="/"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Về trang chủ
                </Link>
                <Link
                    href="/"
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                    Xem đơn hàng
                </Link>
            </div>
        </div>
    );
};

export default PaymentResult;
