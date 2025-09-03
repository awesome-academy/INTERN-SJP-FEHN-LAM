'use client';

import { Review } from '@/types/review';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { DATE_FORMAT } from '@/lib/constants';
import StarRating from '../StarRating';
import { getUserById } from '@/services/users';

interface ReviewItemProps {
    review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
    const [userName, setUserName] = useState<string>('Người dùng ẩn danh');

    const createdAt = review.createdAt ? new Date(review.createdAt) : null;
    const formattedDate = createdAt ? format(createdAt, DATE_FORMAT) : '-';

    useEffect(() => {
        async function fetchUser() {
            if (!review.userId) return;
            try {
                const user = await getUserById(review.userId);
                if (user?.username) setUserName(user.username);
            } catch (error) {
                console.error("Lỗi khi load user:", error);
            }
        }
        fetchUser();
    }, [review.userId]);

    const avatarSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;

    return (
        <div className="flex items-start gap-4 border-b py-5">
            <Avatar className="h-10 w-10">
                <AvatarImage src={avatarSrc} alt={userName} />
            </Avatar>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{userName}</h4>
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>

                <StarRating rating={review.rating} size={16} />
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
        </div>
    );
}
