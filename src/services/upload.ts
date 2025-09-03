export interface UploadResponse {
    success: boolean;
    url?: string;
    error?: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('imageFile', file);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Upload request failed');
    }

    return response.json();
};
