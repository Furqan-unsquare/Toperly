import React, { FC, useState, useEffect } from "react";
import CourseDashboard from "./CourseDashboard";
import CourseForm from "./CourseForm";

const CourseManagementSystem: FC = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [courseData, setCourseData] = useState({
    thumbnail: { filename: "", url: "", bunnyFileId: "" },
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    duration: 0,
    tags: "",
    isPublished: false,
    lessons: [
      {
        _id: undefined,
        name: "",
        description: "",
        video: null,
        videoUrl: "",
        bunnyFileId: "",
        order: 1,
        chapters: [
          {
            _id: undefined,
            title: "",
            startTime: { hours: 0, minutes: 0, seconds: 0 },
            endTime: { hours: 0, minutes: 0, seconds: 0 },
          },
        ],
      },
    ],
    certificate: {
      title: "",
      subtitle: "",
    },
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const API_BASE = "http://localhost:5000/api";

  const getAuthToken = () => localStorage.getItem("token");
  const getCurrentUser = () => {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  };

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    fetchCourses();
  }, []);

  const resetFormData = () => {
    setCourseData({
      thumbnail: { filename: "", url: "", bunnyFileId: "" },
      title: "",
      description: "",
      category: "",
      level: "beginner",
      price: 0,
      duration: 0,
      tags: "",
      isPublished: false,
      lessons: [
        {
          _id: undefined,
          name: "",
          description: "",
          video: null,
          videoUrl: "",
          bunnyFileId: "",
          order: 1,
          chapters: [
            {
              _id: undefined,
              title: "",
              startTime: { hours: 0, minutes: 0, seconds: 0 },
              endTime: { hours: 0, minutes: 0, seconds: 0 },
            },
          ],
        },
      ],
      certificate: { title: "", subtitle: "" },
    });
    setErrors({});
    setUploadProgress({});
  };

  const populateFormForEdit = (course: any) => {
    setCourseData({
      thumbnail: {
        filename: course.thumbnail?.filename || "",
        url: course.thumbnail?.url || "",
        bunnyFileId: course.thumbnail?.bunnyFileId || "",
      },
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      level: course.level || "beginner",
      price: course.price || 0,
      duration: course.duration || 0,
      tags: course.tags?.join(", ") || "",
      isPublished: course.isPublished ?? false,
      lessons:
        course.videos?.length > 0
          ? course.videos.map((video: any, index: number) => ({
              _id: video._id || undefined,
              name: video.title || "",
              description: video.description || "",
              video: null,
              videoUrl: video.url || "",
              bunnyFileId: video.bunnyFileId || "",
              order: video.order || index + 1,
              chapters:
                video.chapters?.length > 0
                  ? video.chapters.map((chapter: any) => ({
                      _id: chapter._id || undefined,
                      title: chapter.title || "",
                      startTime: {
                        hours: chapter.startTime?.hours ?? 0,
                        minutes: chapter.startTime?.minutes ?? 0,
                        seconds: chapter.startTime?.seconds ?? 0,
                      },
                      endTime: {
                        hours: chapter.endTime?.hours ?? 0,
                        minutes: chapter.endTime?.minutes ?? 0,
                        seconds: chapter.endTime?.seconds ?? 0,
                      },
                    }))
                  : [
                      {
                        _id: undefined,
                        title: "",
                        startTime: { hours: 0, minutes: 0, seconds: 0 },
                        endTime: { hours: 0, minutes: 0, seconds: 0 },
                      },
                    ],
            }))
          : [
              {
                _id: undefined,
                name: "",
                description: "",
                video: null,
                videoUrl: "",
                bunnyFileId: "",
                order: 1,
                chapters: [
                  {
                    _id: undefined,
                    title: "",
                    startTime: { hours: 0, minutes: 0, seconds: 0 },
                    endTime: { hours: 0, minutes: 0, seconds: 0 },
                  },
                ],
              },
            ],
      certificate: course.certificate || { title: "", subtitle: "" },
    });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/instructor/myCourses`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        const instructorCourses =
          currentUser?.role === "instructor"
            ? data.filter(
                (course: any) =>
                  course.instructor?._id === currentUser.id ||
                  course.instructor?.id === currentUser.id
              )
            : data;
        setCourses(instructorCourses || []);
        console.log("Fetched courses:", instructorCourses);
      } else {
        showToast("Failed to fetch courses", "error");
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Error fetching courses", "error");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, type: string = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${API_BASE}/url/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: formData,
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    try {
      setUploadProgress({ ...uploadProgress, thumbnail: 0 });
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: any) => {
          const newProgress = (prev.thumbnail || 0) + 20;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, thumbnail: Math.min(newProgress, 80) };
        });
      }, 200);
      const uploadResult = await uploadFile(file, "image");
      const thumbnailData = {
        filename: file.name,
        url: uploadResult.data?.url,
        bunnyFileId: uploadResult.data.public_id || `thumb_${Date.now()}`,
      };
      setCourseData({ ...courseData, thumbnail: thumbnailData });
      setUploadProgress({ ...uploadProgress, thumbnail: 100 });
      showToast("Thumbnail uploaded successfully", "success");
      setTimeout(() => {
        setUploadProgress((prev: any) => ({ ...prev, thumbnail: undefined }));
      }, 1000);
    } catch (error) {
      showToast("Failed to upload thumbnail", "error");
      setUploadProgress((prev: any) => ({ ...prev, thumbnail: undefined }));
    }
  };

  const handleMaterialUpload = async (materialIndex: number, file: File) => {
    if (!file) return;
    const progressKey = `material_${materialIndex}`;
    try {
      setUploadProgress({ ...uploadProgress, [progressKey]: 0 });
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: any) => {
          const newProgress = (prev[progressKey] || 0) + 15;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, [progressKey]: Math.min(newProgress, 80) };
        });
      }, 300);
      const uploadResult = await uploadFile(file, "material");
      const newMaterials = [...courseData.materials];
      newMaterials[materialIndex] = {
        ...newMaterials[materialIndex],
        filename: file.name,
        url: uploadResult.data.url,
        bunnyFileId: uploadResult.data.public_id || `material_${Date.now()}`,
        type: file.type.includes("pdf") ? "pdf" : "document",
        title: newMaterials[materialIndex].title || file.name.split(".")[0],
      };
      setCourseData({ ...courseData, materials: newMaterials });
      setUploadProgress({ ...uploadProgress, [progressKey]: 100 });
      showToast(
        `Material uploaded successfully for material ${materialIndex + 1}`,
        "success"
      );
      setTimeout(() => {
        setUploadProgress((prev: any) => ({
          ...prev,
          [progressKey]: undefined,
        }));
      }, 1000);
    } catch (error) {
      showToast(
        `Failed to upload material for material ${materialIndex + 1}`,
        "error"
      );
      setUploadProgress((prev: any) => ({ ...prev, [progressKey]: undefined }));
    }
  };

  const handleVideoUpload = async (lessonIndex: number, file: File) => {
    if (!file) return;
    const progressKey = `lesson_${lessonIndex}`;
    try {
      setUploadProgress({ ...uploadProgress, [progressKey]: 0 });
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: any) => {
          const newProgress = (prev[progressKey] || 0) + 15;
          if (newProgress >= 80) clearInterval(progressInterval);
          return { ...prev, [progressKey]: Math.min(newProgress, 80) };
        });
      }, 300);
      const uploadResult = await uploadFile(file, "video");
      const newLessons = [...courseData.lessons];
      newLessons[lessonIndex] = {
        ...newLessons[lessonIndex],
        video: file,
        videoUrl: uploadResult.data.url,
        bunnyFileId: uploadResult.data.public_id || `video_${Date.now()}`,
      };
      setCourseData({ ...courseData, lessons: newLessons });
      setUploadProgress({ ...uploadProgress, [progressKey]: 100 });
      showToast(
        `Video uploaded successfully for lesson ${lessonIndex + 1}`,
        "success"
      );
      setTimeout(() => {
        setUploadProgress((prev: any) => ({
          ...prev,
          [progressKey]: undefined,
        }));
      }, 1000);
    } catch (error) {
      showToast(
        `Failed to upload video for lesson ${lessonIndex + 1}`,
        "error"
      );
      setUploadProgress((prev: any) => ({ ...prev, [progressKey]: undefined }));
    }
  };

  const updateLesson = (index: number, field: string, value: any) => {
    const newLessons = [...courseData.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setCourseData({ ...courseData, lessons: newLessons });
  };

  const addLesson = () => {
    const newLesson = {
      _id: undefined,
      name: "",
      description: "",
      video: null,
      videoUrl: "",
      bunnyFileId: "",
      order: courseData.lessons.length + 1,
      chapters: [
        {
          _id: undefined,
          title: "",
          startTime: { hours: 0, minutes: 0, seconds: 0 },
          endTime: { hours: 0, minutes: 0, seconds: 0 },
        },
      ],
    };
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, newLesson],
    });
  };

  const removeLesson = async (index: number) => {
    const lessonToDelete = courseData.lessons[index];
    console.log(lessonToDelete);

    if (lessonToDelete._id) {
      const confirmed = window.confirm(
        "Do you really want to delete this lesson?"
      );
      if (!confirmed) return;

      await deleteLessonFromServer(editingCourse._id, lessonToDelete._id);
    }

    const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  const addChapter = (lessonIndex: number) => {
    const newChapter = {
      _id: undefined,
      title: "",
      startTime: { hours: 0, minutes: 0, seconds: 0 },
      endTime: { hours: 0, minutes: 0, seconds: 0 },
    };
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = [
      ...updatedLessons[lessonIndex].chapters,
      newChapter,
    ];
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  const updateChapter = (
    lessonIndex: number,
    chapterIndex: number,
    field: string,
    value: any
  ) => {
    const updatedLessons = [...courseData.lessons];
    const chapter = { ...updatedLessons[lessonIndex].chapters[chapterIndex] };

    if (field.startsWith("startTime.") || field.startsWith("endTime.")) {
      const [timeField, subField] = field.split(".");
      chapter[timeField] = {
        ...chapter[timeField],
        [subField]: parseInt(value) || 0,
      };
    } else {
      chapter[field] = value;
    }

    updatedLessons[lessonIndex].chapters[chapterIndex] = chapter;
    setCourseData({ ...courseData, lessons: updatedLessons });

    // Validate chapters
    const newErrors = { ...errors };
    const startSeconds =
      chapter.startTime.hours * 3600 +
      chapter.startTime.minutes * 60 +
      chapter.startTime.seconds;
    const endSeconds =
      chapter.endTime.hours * 3600 +
      chapter.endTime.minutes * 60 +
      chapter.endTime.seconds;

    if (!chapter.title.trim()) {
      newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`] =
        "Chapter title is required";
    } else {
      delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_title`];
    }

    if (endSeconds <= startSeconds) {
      newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`] =
        "End time must be greater than start time";
    } else {
      delete newErrors[`lesson_${lessonIndex}_chapter_${chapterIndex}_endTime`];
    }

    for (let i = 0; i < updatedLessons[lessonIndex].chapters.length; i++) {
      if (i !== chapterIndex) {
        const otherChapter = updatedLessons[lessonIndex].chapters[i];
        const otherStartSeconds =
          otherChapter.startTime.hours * 3600 +
          otherChapter.startTime.minutes * 60 +
          otherChapter.startTime.seconds;
        const otherEndSeconds =
          otherChapter.endTime.hours * 3600 +
          otherChapter.endTime.minutes * 60 +
          otherChapter.endTime.seconds;
        if (
          startSeconds <= otherEndSeconds &&
          endSeconds >= otherStartSeconds
        ) {
          newErrors[
            `lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`
          ] = `Chapter "${
            chapter.title || `Chapter ${chapterIndex + 1}`
          }" overlaps with "${otherChapter.title || `Chapter ${i + 1}`}"`;
        } else {
          delete newErrors[
            `lesson_${lessonIndex}_chapter_${chapterIndex}_overlap`
          ];
        }
      }
    }

    setErrors(newErrors);
  };

  const removeChapter = (lessonIndex: number, chapterIndex: number) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[lessonIndex].chapters = updatedLessons[
      lessonIndex
    ].chapters.filter((_, i) => i !== chapterIndex);
    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  const updateQuiz = (
    field: string,
    value: any,
    optionIndex: number | null = null
  ) => {
    const newQuiz = { ...courseData.quizzes[0] };
    if (field === "option" && optionIndex !== null) {
      newQuiz.options[optionIndex] = value;
    } else {
      newQuiz[field] = value;
    }
    setCourseData({ ...courseData, quizzes: [newQuiz] });
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    populateFormForEdit(course);
    setCurrentView("edit");
  };

  const handleCreate = () => {
    setEditingCourse(null);
    resetFormData();
    setCurrentView("create");
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    resetFormData();
    setCurrentView("dashboard");
  };

  const handleDelete = async (courseId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.ok) {
        showToast("Course deleted successfully", "success");
        await fetchCourses();
      } else {
        showToast("Failed to delete course", "error");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("Error deleting course", "error");
    } finally {
      window.location.href = "/all-courses";
      setLoading(false);
    }
  };

  const updateLessonOnServer = async (courseId: string, lesson: any) => {
    if (!lesson._id) return;

    try {
      const response = await fetch(
        `${API_BASE}/courses/${courseId}/videos/${lesson._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            title: lesson.name,
            description: lesson.description,
            order: lesson.order,
            chapters: lesson.chapters,
            duration: 0, // you can calculate or allow input if needed
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to update video");
      }

      showToast(`Lesson "${lesson.name}" updated successfully`, "success");
    } catch (err) {
      console.error("Update video error:", err);
      showToast(`Error updating lesson: ${lesson.name}`, "error");
    }
  };

  const deleteLessonFromServer = async (courseId: string, videoId: string) => {
    try {
      const response = await fetch(
        `${API_BASE}/courses/${courseId}/videos/${videoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete video");
      }

      showToast("Lesson deleted successfully", "success");
    } catch (err) {
      console.error("Delete video error:", err);
      showToast("Error deleting lesson", "error");
    }
  };

  const submitCourse = async (isEdit: boolean) => {
    // ...validation as before, but skip materials/quizzes!
    // Prepare course creation payload (no materials or quizzes)
    const coursePayload = {
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      level: courseData.level,
      price: parseFloat(courseData.price.toString()),
      duration: parseInt(courseData.duration.toString()) || 0,
      tags: courseData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPublished: courseData.isPublished,
      instructorId: currentUser.id,
      certificate: courseData.certificate,
    };

    let response;
    let courseId;

    if (isEdit && editingCourse) {
      response = await fetch(`${API_BASE}/courses/${editingCourse._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(coursePayload),
      });
      courseId = editingCourse._id;
    } else {
      response = await fetch(`${API_BASE}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(coursePayload),
      });
      const courseResult = await response.json();
      courseId = courseResult.course._id;
    }

    // ...Handle errors as above (with .text() check, defensive with json parsing)

    // Handle lessons (as before)
    // Loop over lessons in courseData.lessons and create or update via API.

    // Done! No materials/quizzes logic present.

    if (courseData.thumbnail) {
      await fetch(`${API_BASE}/courses/${courseId}/thumbnail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(courseData.thumbnail),
      });
    }

    if (isEdit && editingCourse) {
      // Loop over lessons
      for (let i = 0; i < courseData.lessons.length; i++) {
        const lesson = courseData.lessons[i];

        // If lesson._id exists and user changed content => update
        if (lesson._id) {
          await updateLessonOnServer(editingCourse._id, lesson);
        }

        // If lesson doesn't have an _id => it's a new one, add via POST
        else if (lesson.name.trim() && lesson.videoUrl && lesson.video) {
          await fetch(`${API_BASE}/courses/${editingCourse._id}/videos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({
              title: lesson.name,
              description: lesson.description,
              filename: lesson.video?.name || `lesson_${i + 1}.mp4`,
              url: lesson.videoUrl,
              bunnyFileId: lesson.bunnyFileId || `video_${Date.now()}_${i}`,
              duration: 0,
              order: lesson.order || i + 1,
              chapters: lesson.chapters || [],
            }),
          });
        }
      }
      window.location.href = "/all-courses";
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen max-w-5xl mx-auto">
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
              toastMessage.type === "success"
                ? "bg-green-600"
                : toastMessage.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {toastMessage.text}
          </div>
        )}
        {currentView === "dashboard" && (
          <CourseDashboard
            courses={courses || []}
            loading={loading}
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setSelectedCourse={setSelectedCourse}
            selectedCourse={selectedCourse}
          />
        )}
        {(currentView === "create" || currentView === "edit") && (
          <CourseForm
            isEdit={currentView === "edit"}
            courseData={courseData}
            errors={errors}
            uploadProgress={uploadProgress}
            loading={loading}
            currentUser={currentUser}
            editingCourse={editingCourse}
            setCourseData={setCourseData}
            setErrors={setErrors}
            setUploadProgress={setUploadProgress}
            handleCancelEdit={handleCancelEdit}
            handleThumbnailUpload={handleThumbnailUpload}
            handleVideoUpload={handleVideoUpload}
            updateLesson={updateLesson}
            submitCourse={submitCourse}
            addLesson={addLesson}
            removeLesson={removeLesson}
            addChapter={addChapter}
            updateChapter={updateChapter}
            removeChapter={removeChapter}
          />
        )}
      </div>
    </div>
  );
};

export default CourseManagementSystem;
