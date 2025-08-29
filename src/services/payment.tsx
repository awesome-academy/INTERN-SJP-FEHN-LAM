import { API_BASE } from "../../env";

interface PaymentData {
    amount: number;
    orderItems: Array<{
        productId: string | number;
        quantity: number;
        price: number;
    }>;
}

interface PaymentResponse {
    paymentUrl: string;
    orderId: string;
}

interface VerifyResponse {
    code: string;
    message: string;
    data?: any;
}

export const createPaymentUrl = async (data: PaymentData): Promise<PaymentResponse> => {
    const response = await fetch(`${API_BASE}/create-payment-url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Could not create payment URL');
    }
    return response.json();
};

export const verifyPayment = async (params: Record<string, string>): Promise<VerifyResponse> => {
    try {
        const vnpParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (key.startsWith('vnp_')) {
                vnpParams.append(key, params[key]);
            }
        });

        const response = await fetch(`${API_BASE}/vnpay-return?${vnpParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Payment verification error:', error);
        throw error;
    }
};
