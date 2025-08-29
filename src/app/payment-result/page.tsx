'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyPayment } from '@/services/payment';
import PaymentResult from '@/components/PaymentResult';
interface VerifyResponse {
    code: string;
    message: string;
    data?: {
        orderId?: string;
        amount?: number;
        transactionNo?: string;
    };
}
export default function PaymentResultPage() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [verificationResult, setVerificationResult] = useState<VerifyResponse | null>(null);

    useEffect(() => {
        const verifyTransaction = async () => {
            try {
                const params: Record<string, string> = {};
                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                const result: VerifyResponse = await verifyPayment(params);
                setVerificationResult(result);
            } catch (error) {
                setVerificationResult({
                    code: '99',
                    message: 'Không thể xác thực thanh toán'
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (searchParams.get('vnp_TxnRef')) {
            verifyTransaction();
        } else {
            setIsLoading(false);
            setVerificationResult({
                code: '98',
                message: 'Không tìm thấy thông tin giao dịch'
            });
        }
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <PaymentResult
            status={verificationResult?.code === '00' ? 'success' : 'error'}
            message={verificationResult?.message || 'Không có thông tin'}
            orderId={verificationResult?.data?.orderId}
            amount={verificationResult?.data?.amount?.toString()}
        />
    );
}
