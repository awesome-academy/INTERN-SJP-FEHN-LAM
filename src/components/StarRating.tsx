import { StarIcon as StarSolid } from '@heroicons/react/20/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

interface StarRatingProps {
    rating: number
    size?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20 }) => {
    return (
        <div className="flex items-center my-1">
            {Array.from({ length: 5 }).map((_, i) =>
                i < rating ? (
                    <StarSolid
                        key={i}
                        className="text-yellow-400"
                        style={{ width: size, height: size }}
                    />
                ) : (
                    <StarOutline
                        key={i}
                        className="text-gray-300"
                        style={{ width: size, height: size }}
                    />
                )
            )}
        </div>
    )
}

export default StarRating
