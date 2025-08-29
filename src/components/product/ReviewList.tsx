'use client';

import { Review } from "@/types/review";
import ReviewItem from "./ReviewItem";
interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (!reviews || reviews.length === 0) {
        return <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>;
    }

    return (
        <div>
            {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
            ))}
        </div>
    );
}
