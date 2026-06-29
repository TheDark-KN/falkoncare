"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/dashboard/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  
  const bookingId = params.bookingId as Id<"bookings">;
  const booking = useQuery(api.bookings.getById, { id: bookingId });
  const submitReview = useMutation(api.bookings.submitReview);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (booking === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center">
        <Icons.loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <TopBar title="Feedback" />
        <div className="p-6 text-center max-w-md mx-auto mt-12">
          <Icons.xCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-bold">Booking not found or unauthorized.</p>
          <Button onClick={() => router.push("/dashboard/bookings")} className="mt-4 rounded-xl bg-blue-600">
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        bookingId,
        rating,
        feedback: comment.trim(),
      });
      setSubmitted(true);
      toast.success("Feedback submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <TopBar title="Rate Your Experience" />

      <div className="p-6 max-w-xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350 mb-6 rounded-xl"
        >
          <Icons.arrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {submitted ? (
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mx-auto mb-2">
              <Icons.checkCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white">Feedback Submitted!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Thank you for sharing your experience. Your rating and feedback have been logged and will help us improve our services.
            </p>
            <Button
              onClick={() => router.push(`/dashboard/bookings/${bookingId}`)}
              className="rounded-xl min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              View Order Details
            </Button>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <CardHeader className="text-center pb-4 p-6 sm:p-8">
              <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-white">
                How was your experience?
              </CardTitle>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{booking.serviceName}</p>
            </CardHeader>
            <CardContent className="space-y-6 p-6 sm:p-8">
              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-115 active:scale-95 duration-200"
                  >
                    <Icons.star
                      className={cn(
                        "w-10 h-10 transition-colors",
                        star <= rating
                          ? "fill-amber-500 text-amber-500"
                          : "text-slate-350 dark:text-slate-750 hover:text-amber-300"
                      )}
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {rating === 0 && "Tap a star to rate"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Add Details
                </label>
                <Textarea
                  placeholder="Share a short review about the hygiene quality, staff behaviour, or timing..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                  rows={4}
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl min-h-[44px] shadow-md shadow-blue-500/10 active:scale-95 duration-200"
                disabled={rating === 0 || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Icons.loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
