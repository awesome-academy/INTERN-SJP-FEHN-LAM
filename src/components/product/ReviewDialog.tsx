'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface ReviewDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    productId: number | string;
    onSubmit: (review: { rating: number; comment: string }) => void;
}

export default function ReviewDialog({ isOpen, onOpenChange, productId, onSubmit }: ReviewDialogProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating > 0 && comment) {
            onSubmit({ rating, comment });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gửi bình luận của bạn</DialogTitle>
                    <DialogDescription>
                        Hãy chia sẻ cảm nhận của bạn về sản phẩm này.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`cursor-pointer h-8 w-8 ${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        ))}
                    </div>
                    <Textarea
                        placeholder="Viết bình luận của bạn ở đây..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Hủy
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={!rating || !comment}>
                        Gửi bình luận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
