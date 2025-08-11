import React from 'react';
import { X, User, BookOpen, Award, Star, Users, Zap } from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  loggedIn?: boolean; // Pass from parent if you have auth state
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, open, onClose, loggedIn = false }) => {
  if (!open || !course) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" 
      style={{ backdropFilter: 'blur(3px)' }}
      aria-modal="true" role="dialog"
    >
      <div className="bg-white rounded-lg w-full max-w-xl shadow-xl p-6 relative border border-gray-100 mx-2">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Thumbnail */}
        <img
          src={course.thumbnail.url || 'https://via.placeholder.com/480x360.png?text=Course'}
          alt={course.title}
          className="rounded-md mb-4 w-full object-cover h-80"/>

        {/* Course Title and ID */}
        <h2 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h2>
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <Award className="w-3 h-3 mr-1" /> Course ID: {course.customId}
        </div>

        <div className="text-gray-600 text-sm line-clamp-3 mb-4" dangerouslySetInnerHTML={{ __html: course.description }} />

        {/* Info Badges */}
        <div className="flex text-xs gap-2 mb-3">
          <span className="flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
            <BookOpen className="w-3 h-3 mr-1" /> {course.category}
          </span>
          <span className="flex items-center px-2 py-0.5 bg-gray-50 text-gray-500 rounded capitalize">
            {course.level}
          </span>
          <span className="flex items-center px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded">
            <Star className="w-3 h-3 mr-1" /> {course.rating}
          </span>
          <span className="flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
            <Users className="w-3 h-3 mr-1" /> 99+ students
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center mb-3">
          <img
            src={'https://i.pinimg.com/736x/98/a6/aa/98a6aadc34b3519d5c4e0a6150f0701f.jpg'}
            alt={typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
            className="w-7 h-7 rounded-full mr-2 border"
          />
          <span className="text-xs text-gray-700">
            {typeof course.instructor === 'string' ? course.instructor : course.instructor.name}
          </span>
        </div>

        {/* Lessons & Updated */}
        <div className="flex text-xs text-gray-500 gap-4 mb-2">
          <span>{course.videos.length} lessons</span>
          <span className="flex items-center">
            <Zap className="w-3 h-3 mr-1" /> Updated {new Date(course.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-gray-900">{`₹${course.price.toFixed(2)}`}</span>
        </div>

        {/* Login or Enroll */}
        {!loggedIn ? (
          <a href="/login"><div className="border justify-center rounded-lg p-3 bg-blue-700 flex items-center gap-2 text-sm text-gray-200 mb-1">
            <User className="w-4 h-4" />Please log in to enroll in this course.
          </div></a>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 w-full py-2 text-white font-semibold rounded-lg transition">
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetailModal;
