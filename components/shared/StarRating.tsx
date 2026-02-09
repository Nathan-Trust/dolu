import React from "react";
import { Star as StarIcon } from "lucide-react"; // Use any star icon from your icon library

interface StarRatingProps {
  rating: number; // The rating value to display (e.g., 1.5, 2, 0.6)
  maxStars?: number; // Total number of stars to display (default is 5)
  size?: number; // Size of the star icons (default is 24)
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 24,
}) => {
  // Generate an array of stars based on the maxStars count
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFullStar = rating >= star; // Full star
        const isHalfStar = rating > star - 1 && rating < star; // Partial star

        return (
          <div key={star} className="relative">
            {isFullStar ? (
              <StarIcon
                fill="currentColor"
                className="text-yellow-500"
                width={size}
                height={size}
              />
            ) : isHalfStar ? (
              <StarIcon
                fill="url(#half)" // Use gradient or clip for half-star
                className="text-yellow-500"
                width={size}
                height={size}
              />
            ) : (
              <StarIcon className="text-gray-300" width={size} height={size} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
