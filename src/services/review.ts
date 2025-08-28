
import { apiClient } from "./api";
import { Review } from '@/types/review';

interface ReviewData {
    productId: number | string;
    userId: number | string;
    rating: number;
    comment: string;
}

export const submitReview = (data: ReviewData) => {
    return apiClient<Review>('/product_reviews', {
        method: 'POST',
        body: data,
    });
};

export const getReviewsByProductId = (productId: number | string) => {
    return apiClient<Review[]>(`/product_reviews?productId=${productId}`);
};
