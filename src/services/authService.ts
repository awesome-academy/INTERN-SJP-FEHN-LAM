import { API_BASE } from "../../env";

interface RegistrationData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
}


const handleResponseError = async (response: Response) => {
    let errorMessage = `Yêu cầu thất bại với mã trạng thái ${response.status}`;
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
    } catch {

    }
    throw new Error(errorMessage);
};



export const login = async (email: string, password: string) => {
    if (!API_BASE) {
        throw new Error('API_BASE chưa được cấu hình trong .env');
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            await handleResponseError(response);
        }

        return await response.json();

    } catch (err: any) {
        throw new Error(err.message || 'Lỗi không xác định khi đăng nhập');
    }
};


export const register = async (userData: RegistrationData) => {
    if (!API_BASE) {
        throw new Error('API_BASE chưa được cấu hình trong .env');
    }

    if (userData.password !== userData.confirmPassword) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp.');
    }

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                address: userData.address,
            }),
        });

        if (!response.ok) {
            await handleResponseError(response);
        }

        return await response.json();

    } catch (err: any) {
        throw new Error(err.message || 'Lỗi không xác định khi đăng ký');
    }
};
export const activateAccount = async (token: string) => {
    if (!API_BASE) {
        throw new Error('API_BASE chưa được cấu hình trong .env');
    }

    try {

        const response = await fetch(`${API_BASE}/activate?token=${token}`, {
            method: 'GET',
        });
        if (!response.ok) {
            await handleResponseError(response);
        }

        return await response.json();

    } catch (err: any) {
        throw new Error(err.message || 'Lỗi không xác định khi kích hoạt tài khoản');
    }
};
