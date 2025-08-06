import React, { useEffect, useState } from "react";
import { Star, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Your helper
import moment from "moment";

const API_BASE = "http://localhost:5000/api";

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
    if (!rating) return alert("Please select a rating");

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
        alert(result.message);
      }
    } catch (err) {
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
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

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>

      {!hasReviewed && currentUser?.role === "student" && isEnrolled && (
        <div className="mb-6">
          <div className="flex items-center mb-2 gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={20}
                className={`cursor-pointer ${
                  num <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>
          <textarea
            className="w-full border rounded-md p-2 mb-2"
            rows={3}
            placeholder="Write a review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="p-4 border rounded-md bg-gray-50 flex justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <User />
                <div>
                  <p className="font-medium">{review.student.name}</p>
                  <p className="text-xs text-gray-500">
                    {moment(review.createdAt).fromNow()}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Star
                    key={num}
                    size={16}
                    className={
                      num <= review.rating ? "text-yellow-500" : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-800">{review.comment}</p>
            </div>

            {currentUser?.id === review.student._id && (
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => handleDelete(review._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseReviewSection;
