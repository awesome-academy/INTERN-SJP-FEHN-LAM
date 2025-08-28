import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
    const stars = Array.from({ length: 5 }).map((_, i) => ({
        filled: i < rating,
        key: i
    }));

    return (
        <div className="flex items-center my-1">
            {stars.map(star => (
                <Star
                    key={star.key}
                    className={`h-${size} w-${size} ${star.filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default StarRating;
