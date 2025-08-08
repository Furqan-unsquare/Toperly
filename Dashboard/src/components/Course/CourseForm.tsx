import React, { FC, useEffect, useState } from "react";
import { ArrowLeft, Upload, Save, Plus, Trash2, Clock } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface CourseFormProps {
  isEdit: boolean;
  loading: boolean;
  courseData: {
    thumbnail: { filename: string; url: string; bunnyfileId: string };
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    duration: number;
    tags: string;
    lessons: {
      _id?: string;
      name: string;
      description: string;
      video: File | null;
      videoUrl: string;
      bunnyFileId?: string;
      order?: number;
      chapters: {
        _id?: string;
        title: string;
        startTime: { hours: number; minutes: number; seconds: number };
        endTime: { hours: number; minutes: number; seconds: number };
      }[];
    }[];
    materials: {
      _id?: string;
      title: string;
      filename: string;
      url: string;
      bunnyFileId?: string;
      type: "pdf" | "document";
    }[];
  };
  errors: { [key: string]: string };
  uploadProgress: { [key: string]: number | undefined };
  currentUser: { id: string; name: string; email: string; role: string } | null;
  editingCourse: any;
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  setUploadProgress: React.Dispatch<React.SetStateAction<any>>;
  handleCancelEdit: () => void;
  handleThumbnailUpload: (file: File) => Promise<void>;
  handleVideoUpload: (lessonIndex: number, file: File) => Promise<void>;
  handleMaterialUpload: (materialIndex: number, file: File) => Promise<void>;
  updateLesson: (index: number, field: string, value: any) => void;
  submitCourse: (isEdit: boolean) => Promise<void>;
}

// GeneralInfoForm Component
const GeneralInfoForm = ({
  courseData,
  setCourseData,
  errors,
  handleThumbnailUpload,
  uploadProgress,
  isEdit,
  currentUser,
  editingCourse,
  handleCancelEdit,
}) => {
  const categories = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Business",
    "Finance",
    "Design",
  ];

  return (
    <div className="max-w-5xl mx-auto ml-5 py-4 rounded-xl shadow-sm">
      <div className="flex justify-between">
        <div className="mb-8 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Edit Course Details" : "Create New Course"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Fill in the essential information to {isEdit ? "update" : "create"} your course
          </p>
        </div>
        <div className="mb-4">
          <button
            onClick={handleCancelEdit}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail *
            <span className="ml-1 text-xs text-gray-500">(Recommended: 1280×720px)</span>
          </label>
          <div className="flex flex-col items-start">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleThumbnailUpload(e.target.files[0])}
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className={`w-96 h-80 flex flex-col justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                errors.thumbnail ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-blue-400"
              }`}
            >
              {courseData.thumbnail?.url ? (
                <div className="relative w-full h-full group">
                  <img
                    src={courseData.thumbnail.url}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover object-center rounded"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                      Change Thumbnail
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Upload className="mx-auto mb-3 text-gray-400" size={24} />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </label>
            {uploadProgress.thumbnail !== undefined && uploadProgress.thumbnail < 100 && (
              <div className="w-full mt-3 max-w-xs">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress.thumbnail}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.thumbnail}%` }}
                  ></div>
                </div>
              </div>
            )}
            {errors.thumbnail && (
              <p className="mt-2 text-sm text-red-600">{errors.thumbnail}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition ${
                errors.title ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
              placeholder="e.g. Advanced Machine Learning"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={courseData.category}
              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition ${
                errors.category ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
            <span className="ml-1 text-xs text-gray-500">
              (Describe what students will learn)
            </span>
          </label>
          <div
            className={`rounded-lg border ${
              errors.description ? "border-red-300" : "border-gray-300"
            } focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500`}
          >
            <ReactQuill
              value={courseData.description}
              onChange={(value) => setCourseData({ ...courseData, description: value })}
              className="min-h-[80px]"
              theme="snow"
              placeholder="Write a detailed description of your course..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Level
            </label>
            <select
              value={courseData.level}
              onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition hover:border-gray-400"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={courseData.price}
                onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition ${
                  errors.price ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              min="0"
              value={courseData.duration}
              onChange={(e) => setCourseData({ ...courseData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition hover:border-gray-400"
              placeholder="e.g. 10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
            <span className="ml-1 text-xs text-gray-500">
              (Separate with commas)
            </span>
          </label>
          <input
            type="text"
            value={courseData.tags}
            onChange={(e) => setCourseData({ ...courseData, tags: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition hover:border-gray-400"
            placeholder="e.g. machine-learning, python, data-analysis"
          />
        </div>
      </div>

      {currentUser && (
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Course created by <span className="font-medium text-gray-700">{currentUser.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

// LessonsForm Component
const LessonsForm = ({
  courseData,
  setCourseData,
  errors,
  uploadProgress,
  handleVideoUpload,
  updateLesson,
  addLesson,
  removeLesson,
  addChapter,
  updateChapter,
  removeChapter,
}) => {
  return (
    <div className="max-w-5xl mx-auto ml-5 py-4 rounded-xl shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-900 mb-8">Course Lessons</h3>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-md font-medium text-gray-700">Lessons</h4>
        <button
          type="button"
          onClick={addLesson}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
        >
          <Plus size={16} className="mr-2" />
          Add New Lesson
        </button>
      </div>
      <div className="space-y-6">
        {Array.isArray(courseData.lessons) && courseData.lessons.length > 0 ? (
          courseData.lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-700">Lesson {lessonIndex + 1}</h4>
                {courseData.lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(lessonIndex)}
                    className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 outline-none"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                  <input
                    type="text"
                    value={lesson.name}
                    onChange={(e) => updateLesson(lessonIndex, "name", e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition ${
                      errors[`lesson_${lessonIndex}_name`] ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Enter lesson name"
                  />
                  {errors[`lesson_${lessonIndex}_name`] && (
                    <p className="text-red-600 text-sm mt-1">{errors[`lesson_${lessonIndex}_name`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Upload</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files && handleVideoUpload(lessonIndex, e.target.files[0])}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition hover:border-gray-400"
                  />
                  {uploadProgress[`lesson_${lessonIndex}`] !== undefined && (
                    <div className="mt-3 max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress[`lesson_${lessonIndex}`]}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[`lesson_${lessonIndex}`]}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {lesson.videoUrl && (
                    <p className="text-sm text-green-600 mt-1">✓ Video uploaded successfully</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Name</label>
                <input
                  type="text"
                  value={lesson.description}
                  onChange={(e) => updateLesson(lessonIndex, "description", e.target.value)}
                  className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition hover:border-gray-400 resize-none"
                  placeholder="Enter lesson name"
                />
              </div>

               {/* Minimal Chapters Section */}
              {/* <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-500 mr-2" />
                    <h5 className="text-sm font-semibold text-gray-700">Chapters</h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => addChapter(lessonIndex)}
                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Chapter
                  </button>
                </div>

                {Array.isArray(lesson.chapters) && lesson.chapters.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No chapters added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {Array.isArray(lesson.chapters) &&
                      lesson.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="bg-white rounded-md p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={chapter.title}
                                onChange={(e) => updateChapter(lessonIndex, chapterIndex, "title", e.target.value)}
                                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none ${
                                  errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                                placeholder="Chapter title"
                              />
                              {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`]}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeChapter(lessonIndex, chapterIndex)}
                              className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="23"
                                  value={chapter.startTime.hours}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "startTime.hours", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                                <span className="text-gray-500">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={chapter.startTime.minutes}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "startTime.minutes", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                                <span className="text-gray-500">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={chapter.startTime.seconds}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "startTime.seconds", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                              </div>
                            </div>

                            
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="23"
                                  value={chapter.endTime.hours}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "endTime.hours", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                                <span className="text-gray-500">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={chapter.endTime.minutes}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "endTime.minutes", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                                <span className="text-gray-500">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="59"
                                  value={chapter.endTime.seconds}
                                  onChange={(e) => updateChapter(lessonIndex, chapterIndex, "endTime.seconds", e.target.value)}
                                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-500 outline-none text-center"
                                  placeholder="00"
                                />
                              </div>
                            </div>
                          </div>

                         
                          {(errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] || 
                            errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`]) && (
                            <div className="mt-2 text-xs text-red-600">
                              {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] && (
                                <p>{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`]}</p>
                              )}
                              {errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`] && (
                                <p>{errors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`]}</p>
                              )}
                            </div>
                          )}

                          
                        </div>
                      ))}
                  </div>
                )}
              </div> */}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No lessons added yet. Click "Add New Lesson" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// CourseForm Component
const CourseForm = ({
  isEdit,
  loading,
  courseData,
  errors,
  uploadProgress,
  currentUser,
  editingCourse,
  setCourseData,
  setErrors,
  setUploadProgress,
  handleCancelEdit,
  handleThumbnailUpload,
  handleVideoUpload,
  handleMaterialUpload,
  updateLesson,
  addLesson,
  removeLesson,
  submitCourse,
}) => {
  const [showLessons, setShowLessons] = useState(false);

  // Initialize default blank fields for new course
  useEffect(() => {
    if (!isEdit && (!courseData?.lessons?.length || !courseData?.materials?.length)) {
      setCourseData({
        ...courseData,
        lessons: [
          {
            name: "",
            description: "",
            video: null,
            videoUrl: "",
            bunnyFileId: "",
            order: 1,
            chapters: [
              {
                title: "",
                startTime: { hours: 0, minutes: 0, seconds: 0 },
                endTime: { hours: 0, minutes: 0, seconds: 0 },
              },
            ],
          },
        ],
        materials: [
          {
            title: "",
            filename: "",
            url: "",
            bunnyFileId: "",
            type: "document",
          },
        ],
      });
    }
  }, [isEdit, courseData, setCourseData]);

  // Guard clause for undefined courseData
  if (!courseData) {
    console.error("CourseForm received undefined courseData");
    return <div>Error: Course data not initialized</div>;
  }

  // Add new lesson
  // const addLesson = () => {
  //   const newLesson = {
  //     name: "",
  //     description: "",
  //     video: null,
  //     videoUrl: "",
  //     bunnyFileId: "",
  //     order: (courseData.lessons.length || 0) + 1,
  //     chapters: [
  //       {
  //         title: "",
  //         startTime: { hours: 0, minutes: 0, seconds: 0 },
  //         endTime: { hours: 0, minutes: 0, seconds: 0 },
  //       },
  //     ],
  //   };
  //   setCourseData({
  //     ...courseData,
  //     lessons: Array.isArray(courseData.lessons) ? [...courseData.lessons, newLesson] : [newLesson],
  //   });
  // };

  // // Remove lesson
  // const removeLesson = (index: number) => {
  //   if (Array.isArray(courseData.lessons) && courseData.lessons.length > 1) {
  //     const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
  //     setCourseData({ ...courseData, lessons: updatedLessons });
  //   }
  // };

  // Add new chapter to a lesson
  const addChapter = (lessonIndex: number) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex]) return;
    const newChapter = {
      title: "",
      startTime: { hours: 0, minutes: 0, seconds: 0 },
      endTime: { hours: 0, minutes: 0, seconds: 0 },
    };
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = Array.isArray(updatedLessons[lessonIndex].chapters)
      ? [...updatedLessons[lessonIndex].chapters, newChapter]
      : [newChapter];
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  // Update chapter field with overlap validation
  const updateChapter = (lessonIndex: number, chapterIndex: number, field: string, value: any) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex] || !Array.isArray(courseData.lessons[lessonIndex].chapters)) return;
    const updatedLessons = [...courseData.lessons];
    const chapter = { ...updatedLessons[lessonIndex].chapters[chapterIndex] };

    if (field.startsWith("startTime.") || field.startsWith("endTime.")) {
      const [timeField, subField] = field.split(".");
      chapter[timeField] = { ...chapter[timeField], [subField]: parseInt(value) || 0 };
    } else {
      chapter[field] = value;
    }

    // Validate chapter times
    const startSeconds = chapter.startTime.hours * 3600 + chapter.startTime.minutes * 60 + chapter.startTime.seconds;
    const endSeconds = chapter.endTime.hours * 3600 + chapter.endTime.minutes * 60 + chapter.endTime.seconds;

    if (endSeconds <= startSeconds) {
      setErrors((prev) => ({
        ...prev,
        [`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`]: "End time must be greater than start time",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`];
        return newErrors;
      });
    }

    // Check for overlaps with other chapters
    for (let i = 0; i < updatedLessons[lessonIndex].chapters.length; i++) {
      if (i !== chapterIndex) {
        const otherChapter = updatedLessons[lessonIndex].chapters[i];
        const otherStartSeconds = otherChapter.startTime.hours * 3600 + otherChapter.startTime.minutes * 60 + otherChapter.startTime.seconds;
        const otherEndSeconds = otherChapter.endTime.hours * 3600 + otherChapter.endTime.minutes * 60 + otherChapter.endTime.seconds;
        if (startSeconds <= otherEndSeconds && endSeconds >= otherStartSeconds) {
          setErrors((prev) => ({
            ...prev,
            [`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`]: `Chapter ${chapter.title || `Chapter ${chapterIndex + 1}`} overlaps with ${otherChapter.title || `Chapter ${i + 1}`}`,
          }));
          return;
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`];
            return newErrors;
          });
        }
      }
    }

    updatedLessons[lessonIndex].chapters[chapterIndex] = chapter;
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  // Remove chapter
  const removeChapter = (lessonIndex: number, chapterIndex: number) => {
    if (!Array.isArray(courseData.lessons) || !courseData.lessons[lessonIndex] || !Array.isArray(courseData.lessons[lessonIndex].chapters)) return;
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = updatedLessons[lessonIndex].chapters.filter((_, i) => i !== chapterIndex);
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  // Add new material
  const addMaterial = () => {
    const newMaterial = {
      title: "",
      filename: "",
      url: "",
      bunnyFileId: "",
      type: "document",
    };
    setCourseData({
      ...courseData,
      materials: Array.isArray(courseData.materials) ? [...courseData.materials, newMaterial] : [newMaterial],
    });
  };

  // Update material field
  const updateMaterial = (materialIndex: number, field: string, value: any) => {
    if (!Array.isArray(courseData.materials)) return;
    const updatedMaterials = [...courseData.materials];
    updatedMaterials[materialIndex] = { ...updatedMaterials[materialIndex], [field]: value };

    const material = updatedMaterials[materialIndex];
    const newErrors = { ...errors };

    if (!material.title) {
      newErrors[`material_${materialIndex}_title`] = "Material title is required";
    } else {
      delete newErrors[`material_${materialIndex}_title`];
    }

    if (!material.url && material.type === "document") {
      newErrors[`material_${materialIndex}_url`] = "Google Drive link is required";
    } else {
      delete newErrors[`material_${materialIndex}_url`];
    }

    if (!["pdf", "document"].includes(material.type)) {
      newErrors[`material_${materialIndex}_type`] = "Material type must be pdf or document";
    } else {
      delete newErrors[`material_${materialIndex}_type`];
    }

    setErrors(newErrors);
    setCourseData({ ...courseData, materials: updatedMaterials });
  };

  // Remove material
  const removeMaterial = (materialIndex: number) => {
    if (!Array.isArray(courseData.materials)) return;
    const updatedMaterials = courseData.materials.filter((_, i) => i !== materialIndex);
    setCourseData({ ...courseData, materials: updatedMaterials });
  };

  return (
    <div className="space-y-8">
      <GeneralInfoForm
        courseData={courseData}
        setCourseData={setCourseData}
        errors={errors}
        handleThumbnailUpload={handleThumbnailUpload}
        uploadProgress={uploadProgress}
        isEdit={isEdit}
        currentUser={currentUser}
        editingCourse={editingCourse}
        handleCancelEdit={handleCancelEdit}
      />
      <div className="max-w-5xl mx-auto ml-5">
        <button
          onClick={() => setShowLessons(!showLessons)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
        >
          {showLessons ?  "" : <Plus size={16} className="mr-2" />}
          {showLessons ? "Hide Lessons" : "Add Lessons"}
        </button>
      </div>
      {showLessons && (
        <LessonsForm
          courseData={courseData}
          setCourseData={setCourseData}
          errors={errors}
          uploadProgress={uploadProgress}
          handleVideoUpload={handleVideoUpload}
          updateLesson={updateLesson}
          addLesson={addLesson}
          removeLesson={removeLesson}
          addChapter={addChapter}
          updateChapter={updateChapter}
          removeChapter={removeChapter}
        />
      )}
      <div className="max-w-5xl mx-auto ml-5 flex justify-end gap-4">
        <button
          onClick={handleCancelEdit}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={() => submitCourse(isEdit)}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save size={16} />
              {isEdit ? "Update Course" : "Create Course"}
            </>
          )}
        </button>
      </div>
      {errors.submit && <p className="text-red-600 text-sm mt-4 max-w-5xl mx-auto ml-5">{errors.submit}</p>}
    </div>
  );
};

export default CourseForm;