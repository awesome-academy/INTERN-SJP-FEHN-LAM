const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('Biến môi trường NEXT_PUBLIC_API_BASE_URL chưa được cấu hình.');
}

const handleResponseError = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = `Yêu cầu thất bại với mã trạng thái ${response.status}`;
        try {

            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {

        }
        throw new Error(errorMessage);
    }
};

interface ApiClientOptions extends RequestInit {
    body?: any;
}

export const apiClient = async <T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> => {
    const { body, ...customConfig } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const config: RequestInit = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        await handleResponseError(response);
        return await response.json();

    } catch (err: any) {

        throw new Error(err.message || 'Lỗi không xác định từ API client');
    }
};
