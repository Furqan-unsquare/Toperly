import Course from "../models/Course.js";
import Instructor from "../models/Instructor.js";
import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      thumbnail,
      instructorId,
      videos,
      materials,
    } = req.body;

    let instructorObjectId;

    if (instructorId) {
      let instructor = await Instructor.findOne({ customId: instructorId });
      if (!instructor && mongoose.Types.ObjectId.isValid(instructorId)) {
        instructor = await Instructor.findById(instructorId);
      }
      if (!instructor) {
        return res.status(404).json({
          message:
            "Instructor not found. Please provide a valid instructor customId or ObjectId.",
        });
      }
      instructorObjectId = instructor._id;
    } else if (req.user?.id) {
      instructorObjectId = req.user.id;
    } else {
      return res.status(400).json({ message: "Instructor ID is required" });
    }

    const course = new Course({
      title,
      description,
      instructor: instructorObjectId,
      category,
      level,
      price,
      duration,
      thumbnail,
      videos: videos || [],
      materials: materials || [],
    });

    await course.save();
    await course.populate("instructor", "name email customId");

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res
      .status(500)
      .json({ message: "Server error creating course", error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { category, level, instructor, topRated, inDemand } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (instructor) filter.instructor = instructor;
    if (topRated) filter.topRated = topRated === 'true';
    if (inDemand) filter.inDemand = inDemand === 'true';

    const courses = await Course.find(filter)
      .populate("instructor", "name email bio expertise")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({ message: "Server error fetching courses" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, level, price, duration, videos, topRated, inDemand } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (topRated !== undefined && topRated && !course.topRated) {
      const topRatedCount = await Course.countDocuments({ topRated: true });
      if (topRatedCount >= 3) {
        return res.status(400).json({ message: "Cannot set more than 3 courses as Top Rated" });
      }
    }

    if (inDemand !== undefined && inDemand && !course.inDemand) {
      const inDemandCount = await Course.countDocuments({ inDemand: true });
      if (inDemandCount >= 10) {
        return res.status(400).json({ message: "Cannot set more than 10 courses as In Demand" });
      }
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (level) course.level = level;
    if (price !== undefined) course.price = price;
    if (duration !== undefined) course.duration = duration;
    if (videos) course.videos = videos;
    if (topRated !== undefined) course.topRated = topRated;
    if (inDemand !== undefined) course.inDemand = inDemand;

    course.updatedAt = new Date();
    await course.save();
    await course.populate("instructor", "name email");

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    console.error("Update course error:", error);
    res
      .status(500)
      .json({ message: "Server error updating course", error: error.message });
  }
};

export const addVideoToCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      filename,
      url,
      bunnyFileId,
      duration,
      order,
      chapters,
    } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.videos.push({
      title,
      description,
      filename,
      url,
      bunnyFileId,
      duration,
      order,
    });
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Video added to course successfully", course });
  } catch (error) {
    console.error("Add video error:", error);
    res.status(500).json({ message: "Server error adding video to course" });
  }
};

export const updateVideoInCourse = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, order, chapters, duration } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const video = course.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found in course" });
    }

    if (title) video.title = title;
    if (description) video.description = description;
    if (order !== undefined) video.order = order;
    if (duration !== undefined) video.duration = duration;

    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Video updated successfully", course });
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({ message: "Server error updating video in course" });
  }
};

export const deleteVideoFromCourse = async (req, res) => {
  try {
    const { id, videoId } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const initialLength = course.videos.length;
    course.videos = course.videos.filter(
      (video) => video._id.toString() !== videoId
    );

    if (course.videos.length === initialLength) {
      return res.status(404).json({ message: "Video not found in course" });
    }

    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Video deleted successfully", course });
  } catch (error) {
    console.error("Delete video error:", error);
    res
      .status(500)
      .json({ message: "Server error deleting video from course" });
  }
};

export const addThumbnailToCourse = async (req, res) => {
  try {
    const { filename, url, bunnyFileId } = req.body;
    const course = await Course.findById(req.params.id);
    console.log(url);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.thumbnail = { filename, url, bunnyFileId };
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Thumbnail added to course successfully", course });
  } catch (error) {
    console.error("Add thumbnail error:", error);
    res
      .status(500)
      .json({ message: "Server error adding thumbnail to course" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error deleting course" });
  }
};

export const getInstructorsCourses = async (req, res) => {
  try {
    const { id } = req.user;

    const course = await Course.find({ instructor: id });

    if (!course) {
      return res.status(404).json({ message: "No course found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const addMaterialToCourse = async (req, res) => {
  try {
    const { title, filename, url, bunnyFileId, type, content } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!title || !filename || !url || !type) {
      return res
        .status(400)
        .json({ message: "Title, filename, url, and type are required" });
    }

    const validTypes = ["pdf", "image", "document"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          message: "Invalid material type. Must be pdf, image, or document",
        });
    }

    const exists = course.materials.some(
      (m) => m.filename === filename || m.url === url
    );
    if (exists) {
      return res
        .status(409)
        .json({ message: "Material with the same file or URL already exists" });
    }

    const material = {
      title,
      filename,
      url,
      bunnyFileId: bunnyFileId || `material_${Date.now()}`,
      type,
      ...(content && type === "document" ? { content } : {}),
    };

    course.materials.push(material);
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Material added to course successfully", course });
  } catch (error) {
    console.error("Add material error:", error);
    res
      .status(500)
      .json({
        message: "Server error adding material to course",
        error: error.message,
      });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { title, filename, url, bunnyFileId, type, content } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const material = course.materials.find((m) => m.bunnyFileId === materialId);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (title) material.title = title;
    if (filename) material.filename = filename;
    if (url) material.url = url;
    if (bunnyFileId) material.bunnyFileId = bunnyFileId;
    if (type) material.type = type;
    if (content && type === "document") material.content = content;

    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Material updated successfully", material });
  } catch (err) {
    console.error("Update material error:", err);
    res
      .status(500)
      .json({ message: "Server error updating material", error: err.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const index = course.materials.findIndex(
      (m) => m.bunnyFileId === materialId
    );
    if (index === -1) {
      return res.status(404).json({ message: "Material not found" });
    }

    course.materials.splice(index, 1);
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("Delete material error:", err);
    res
      .status(500)
      .json({ message: "Server error deleting material", error: err.message });
  }
};

export const addChapterToVideo = async (req, res) => {
  try {
    const { id, videoId } = req.params;
    const { title, startTime, endTime } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const video = course.videos.find((v) => v._id == videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const chapter = { title, startTime, endTime };
    video.chapters.push(chapter);
    course.updatedAt = new Date();
    await course.save();
    res
      .status(201)
      .json({
        message: "Chapter added successfully",
        chapters: video.chapters,
      });
  } catch (err) {
    console.error("Add chapter error:", err);
    res
      .status(500)
      .json({ message: "Server error adding chapter", error: err.message });
  }
};

export const updateChapter = async (req, res) => {
  try {
    const { id, videoId, chapterId } = req.params;
    const { title, startTime, endTime } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const video = course.videos.find((v) => v.bunnyFileId === videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const chapterIndex = video.chapters.findIndex(
      (_, idx) => idx.toString() === chapterId
    );
    if (chapterIndex === -1)
      return res.status(404).json({ message: "Chapter not found" });

    if (title) video.chapters[chapterIndex].title = title;
    if (startTime) video.chapters[chapterIndex].startTime = startTime;
    if (endTime) video.chapters[chapterIndex].endTime = endTime;

    course.updatedAt = new Date();
    await course.save();

    res.json({
      message: "Chapter updated successfully",
      chapter: video.chapters[chapterIndex],
    });
  } catch (err) {
    console.error("Update chapter error:", err);
    res
      .status(500)
      .json({ message: "Server error updating chapter", error: err.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { id, videoId, chapterId } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const video = course.videos.find((v) => v.bunnyFileId === videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const chapterIndex = video.chapters.findIndex(
      (_, idx) => idx.toString() === chapterId
    );
    if (chapterIndex === -1)
      return res.status(404).json({ message: "Chapter not found" });

    video.chapters.splice(chapterIndex, 1);
    course.updatedAt = new Date();
    await course.save();

    res.json({ message: "Chapter deleted successfully" });
  } catch (err) {
    console.error("Delete chapter error:", err);
    res
      .status(500)
      .json({ message: "Server error deleting chapter", error: err.message });
  }
};

export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = status;
    course.updatedAt = new Date();
    await course.save();

    res
      .status(200)
      .json({ message: `Course status updated to '${status}'`, course });
  } catch (error) {
    console.error("Error updating course status:", error);
    res.status(500).json({ message: "Server error updating course status" });
  }
};

export const addCourseInclude = async (req, res) => {
  try {
    const { id } = req.params;
    const { include } = req.body;

    if (!include || typeof include !== 'string') {
      return res.status(400).json({ error: 'Include must be a non-empty string' });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.courseIncludes.push(include);
    await course.save();

    res.status(200).json({ message: 'Include added', courseIncludes: course.courseIncludes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add include', details: err.message });
  }
};

export const updateCourseInclude = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { include } = req.body;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.courseIncludes[index]) {
      return res.status(404).json({ error: 'Include not found at given index' });
    }

    course.courseIncludes[index] = include;
    await course.save();

    res.status(200).json({ message: 'Include updated', courseIncludes: course.courseIncludes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update include', details: err.message });
  }
};

export const deleteCourseInclude = async (req, res) => {
  try {
    const { id, index } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.courseIncludes[index]) {
      return res.status(404).json({ error: 'Include not found at given index' });
    }

    course.courseIncludes.splice(index, 1);
    await course.save();

    res.status(200).json({ message: 'Include deleted', courseIncludes: course.courseIncludes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete include', details: err.message });
  }
};