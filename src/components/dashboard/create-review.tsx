"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Star, Loader2, CheckCircle, X } from "lucide-react";
import { createReview } from "@/src/lib/actions/user-actions";
import { useRouter } from "next/navigation";

interface CreateReviewProps {
  orderId: string;
  serviceId: string;
}

export function CreateReview({ orderId, serviceId }: CreateReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createReview({
        orderId,
        serviceId,
        rating,
        comment,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError("Failed to submit review. You may have already reviewed this.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="font-bold uppercase tracking-wider text-xs border-[#f5e642] text-[#f5e642] hover:bg-[#f5e642] hover:text-black transition-colors"
      >
        Leave Review
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-[425px] bg-[#0d0d0d] border border-white/10 p-6 shadow-xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h2 className="text-xl font-bold font-mono text-[#f5e642]">
                {isSuccess ? "Review Submitted!" : "Rate your Experience"}
              </h2>
            </div>

            {isSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-[#00ffcc] mx-auto mb-4" />
                <p className="text-white/80">Thank you for your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${rating >= star ? 'text-[#f5e642]' : 'text-white/20'}`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  ))}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="comment" className="text-white/80">Comment (Optional)</Label>
                  <Textarea 
                    id="comment" 
                    placeholder="Tell others about your experience..."
                    className="col-span-3 bg-[#111] border-white/10 text-white min-h-[100px] focus:border-[#f5e642]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="mt-4 w-full font-bold uppercase tracking-wider bg-[#f5e642] text-black hover:bg-[#f5e642]/80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
