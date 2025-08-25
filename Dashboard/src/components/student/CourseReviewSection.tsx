import React, { useEffect, useState } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import moment from "moment";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;


const CourseReviewSection = ({ courseId, currentUser, isEnrolled }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${courseId}`);
      const data = await res.json();
      setReviews(data);

      if (currentUser) {
        const reviewed = data.find((r) => r.student._id === currentUser.id);
        setHasReviewed(!!reviewed);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reviews/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const result = await res.json();
      if (res.ok) {
        setRating(0);
        setComment("");
        setHasReviewed(true);
        fetchReviews();
      } else {
        alert(result.message || "Failed to submit review");
      }
    } catch (err) {
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`${API_BASE}/reviews/${courseId}/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchReviews();
        setHasReviewed(false);
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      alert("Error deleting review");
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const averageRating = getAverageRating();

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{averageRating}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    size={16}
                    className={
                      num <= Math.round(averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span>({reviews.length})</span>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {!hasReviewed && currentUser?.role === "student" && isEnrolled && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Write a review
          </h3>

          {/* Star Rating */}
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Star
                  key={num}
                  size={20}
                  className={`cursor-pointer ${
                    num <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(num)}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Share your thoughts about this course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || !rating}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="p-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="flex gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {review.student.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {moment(review.createdAt).fromNow()}
                      </span>
                    </div>

                    {currentUser?.id === review.student._id && (
                      <button
                        className="text-gray-400 hover:text-red-500 p-1"
                        onClick={() => handleDelete(review._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        size={14}
                        className={
                          num <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviewSection;
