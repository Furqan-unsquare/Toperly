// CourseDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Users, 
  PlayCircle, 
  Award, 
  BookOpen, 
  Download, 
  CheckCircle,
  Globe,
  Calendar,Play ,
  Trophy,
  Zap,
  User,
  Loader
} from 'lucide-react';
import { isToday } from 'date-fns';

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: { _id: string; name: string } | string;
  category: string;
  level: string;
  price: number;
  duration: number;
  isPublished: string;
  rating: number;
  totalReviews: number;
  createdAt: string ;
  updatedAt: string;
  customId: string;
  thumbnail: { filename?: string; url?: string };
  materials: any[];
  videos: any[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const result = await response.json();
        console.log(result)
        setCourse(result.data || result);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;
  
  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return <Zap className="w-4 h-4" />;
      case 'intermediate': return <Trophy className="w-4 h-4" />;
      case 'advanced': return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen mt-16 md:mt-28 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-sm font-medium">{course.category}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 text-sm">Course Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
  <div className="relative">
    <img
      src="https://toperly.com/wp-content/uploads/2025/07/Machine_learning_thumbnail-480x360.webp"
      alt={course.title}
      className="w-full h-64 md:h-80 object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    <button 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Play course preview"
    >
      <Play className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
    </button>
    <div className="absolute bottom-6 left-6 right-6">
      <div className="flex items-center space-x-3 mb-4">
        {/* <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize flex items-center ${getLevelColor(course.level)}`}>
          {getLevelIcon(course.level)}
          <span className="ml-1">{course.level}</span>
        </span> */}
        {/* {course.isPublished === 'approved' && (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Published
          </span>
        )} */}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
        {course.title}
      </h1>
    </div>
  </div>
</div>

            {/* Course Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                Course Overview
              </h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.duration}</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <PlayCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.videos?.length || 0}</div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{course.materials?.length || 0}</div>
                  <div className="text-sm text-gray-600">Resources</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">150+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </div>
            </div>

            {/* Instructor Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                Your Instructor
              </h2>
              
              <div className="flex items-start space-x-4">
                <img
                  src="https://i.pinimg.com/736x/98/a6/aa/98a6aadc34b3519d5c4e0a6150f0701f.jpg"
                  alt={typeof course.instructor === 'string' ? course.instructor : course.instructor?.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-100"
                />
                <div className="flex-1">
                  <h3 className="md:text-xl font-semibold text-gray-900">
                    {typeof course.instructor === 'string' ? course.instructor : course.instructor?.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">Expert Instructor</p>
                  <p className="text-gray-600">
                    Experienced professional with expertise in {course.category.toLowerCase()} 
                    and a passion for teaching cutting-edge technologies.
                  </p>
                  
                  <div className="flex items-center mt-4 space-x-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Trophy className="w-4 h-4 mr-1" />
                      5+ years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      1000+ students taught
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Course ID</span>
                    <span className="text-gray-900 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {course.customId}
                    </span>
                  </div> */}
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Category</span>
                    <span className="text-gray-900">{course.category}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Level</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Created</span>
                    <span className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Last Updated</span>
                    <span className="text-gray-900 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div> */}
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Language</span>
                    <span className="text-gray-900 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      English
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center mr-2">
                      <span className="text-lg font-bold text-gray-900 mr-1">
                        {course.rating || 'N/A'}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < Math.floor(course.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-gray-500">({course.totalReviews?.toLocaleString() || 0})</span>
                  </div>
                </div>

                <a href="/auth/login"><button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Enroll Now
                </button></a>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">30-day money-back guarantee</p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This course includes:</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <PlayCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>{course.duration} hours of video content</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Download className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>{course.materials?.length || 0} downloadable resources</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Award className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;