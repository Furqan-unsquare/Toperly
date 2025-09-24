import React, { FC } from "react";
import { Plus, Play, Award, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

interface Course {
  _id: string;
  customId?: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price: number;
  duration?: number;
  tags?: string;
  videos?: {
    _id?: string;
    title: string;
    url: string;
    order: number;
    description?: string;
    bunnyFileId?: string;
    chapters: {
      _id?: string;
      title: string;
      startTime: { hours: number; minutes: number; seconds: number };
      endTime: { hours: number; minutes: number; seconds: number };
    }[];
  }[];
  lessons?: {
    name: string;
    description: string;
    videoUrl: string;
    chapters: {
      _id?: string;
      title: string;
      startTime: { hours: number; minutes: number; seconds: number };
      endTime: { hours: number; minutes: number; seconds: number };
    }[];
  }[];
  thumbnail?: { url: string };
  instructor?: { _id: string; id?: string; name: string };
  createdAt: string;
  updatedAt?: string;
  materials: {
    title: string;
    filename: string;
    url: string;
    bunnyFileId?: string;
    type: "pdf" | "document";
  }[];
  isPublished: "approved" | "rejected" | "pending"; // Added isPublished field
}

interface CourseDashboardProps {
  courses: Course[];
  loading: boolean;
  handleCreate: () => void;
  handleEdit: (course: Course) => void;
  handleDelete: (courseId: string) => Promise<void>;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  selectedCourse: Course | null;
}

const CourseDashboard: FC<CourseDashboardProps> = ({
  courses = [],
  loading,
  handleCreate,
  handleEdit,
  handleDelete,
}) => {
  const CourseCard = ({
    course,
    onClick,
  }: {
    course: Course;
    onClick: (course: Course) => void;
  }) => {
    // Determine the status icon and color based on isPublished
    const getStatusIcon = () => {
  switch (course.isPublished) {
    case "approved":
      return (
        <img
          src="https://pngimg.com/uploads/approved/approved_PNG1.png" // ✅ put your image path here
          alt="Approved"
          className="w-14 -rotate-12"
        />
      );
    case "rejected":
      return (
        <img
          src="https://www.onlygfx.com/wp-content/uploads/2016/09/red-rejected-stamp-5-1024x771.png"
          alt="Rejected"
          className="w-16 rotate-2"
        />
      );
    case "pending":
      return (
        <img
          src="https://png.pngtree.com/png-clipart/20230918/original/pngtree-pending-review-stamp-check-picture-image_13053786.png"
          alt="Pending"
          className="w-16"
        />
      );
    default:
      return null;
  }
};


    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 bg-gray-200 flex items-center justify-center">
          {course.thumbnail ? (
            <img
              src={course.thumbnail.url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Play size={48} className="text-gray-400" />
          )}
          {/* Status Icon in Top-Right Corner */}
          <div className="absolute top-0 left-0 rounded-full shadow-sm">
            {getStatusIcon()}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{course.title}</h3>
          <p
            className="text-gray-600 text-sm mb-3 line-clamp-1"
            dangerouslySetInnerHTML={{ __html: course.description }}
          ></p>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {course.level}
            </span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {course.category}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
            <span>{course.lessons?.length || course.videos?.length || 0} lessons</span>
            <span className="font-bold text-green-600">₹{course.price}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onClick(course)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
            >
              Edit Course
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(course._id);
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
              title="Delete Course"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your courses - Create, Edit, and Delete
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <Award size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
          <p className="text-gray-500 mb-4">Create your first course to get started</p>
          <button
            onClick={handleCreate}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} onClick={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDashboard;