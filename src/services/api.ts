const API_BASE = 'http://localhost:3001';

const fetcher = async (endpoint: string) => {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Lỗi khi gọi API: ${endpoint}`);
    return await response.json();
};

export { API_BASE, fetcher };
