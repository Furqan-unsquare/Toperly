import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  FileText,
  Image,
  File,
  Loader,
  Eye,
  X,
  Save,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

interface Material {
  _id?: string;
  title: string;
  filename: string;
  url: string;
  bunnyFileId: string;
  type: "pdf" | "image" | "document";
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  materials: Material[];
}

const MaterialsManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<{
    material: Material;
    courseId: string;
  } | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set()
  );

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    type: "pdf" as Material["type"],
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchCoursesWithMaterials();
    fetchAllCourses();
  }, []);

  const fetchCoursesWithMaterials = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      const coursesWithMaterials = coursesData.filter(
        (course) => course.materials && course.materials.length > 0
      );
      setCourses(coursesWithMaterials);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const coursesData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setAllCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch all courses:", error);
      setAllCourses([]);
    }
  };

  // Handler for adding new material
  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setFormData({
      title: "",
      courseId: "",
      type: "pdf",
      content: "",
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setShowCreateForm(true);
  };

  // Handler for editing material
  const handleEditMaterial = (material: Material, courseId: string) => {
    setEditingMaterial({ material, courseId });
    setFormData({
      title: material.title,
      courseId: courseId,
      type: material.type,
      content: material.content || "",
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setShowCreateForm(true);
  };

  const handleDeleteMaterial = async (courseId: string, materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE}/api/courses/${courseId}/materials/${materialId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCoursesWithMaterials();
      alert("Material deleted successfully!");
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Failed to delete material");
    }
  };

  const uploadFile = async (
    file: File
  ): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE}/api/url/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        }
      );

      return {
        url: response.data.data.url,
        filename: file.name,
      };
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw new Error("Failed to upload file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let fileData = null;

      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      } else if (!editingMaterial) {
        alert("Please select a file to upload");
        return;
      }

      const payload = {
        title: formData.title,
        type: formData.type,
        content: formData.content || undefined,
        ...(fileData && {
          filename: fileData.filename,
          url: fileData.url,
          bunnyFileId: `material_${Date.now()}`,
        }),
        ...(editingMaterial &&
          !fileData && {
            filename: editingMaterial.material.filename,
            url: editingMaterial.material.url,
            bunnyFileId: editingMaterial.material.bunnyFileId,
          }),
      };

      const token = localStorage.getItem("token");

      if (editingMaterial) {
        await axios.put(
          `${API_BASE}/api/courses/${formData.courseId}/materials/${editingMaterial.material.bunnyFileId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Material updated successfully!");
      } else {
        await axios.post(
          `${API_BASE}/api/courses/${formData.courseId}/materials`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Material created successfully!");
      }

      setShowCreateForm(false);
      setEditingMaterial(null);
      await fetchCoursesWithMaterials();
    } catch (error: any) {
      console.error("Failed to save material:", error);
      alert(error.response?.data?.message || "Failed to save material");
    } finally {
      setFormLoading(false);
      setUploadProgress(0);
    }
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "image":
        return <Image className="w-4 h-4 text-green-500" />;
      case "document":
        return <File className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800 border-red-200";
      case "image":
        return "bg-green-100 text-green-800 border-green-200";
      case "document":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter logic
  const filteredCourses = courses.filter((course) => {
    if (selectedCourse && course._id !== selectedCourse) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchLower) ||
        course.materials.some(
          (material) =>
            material.title.toLowerCase().includes(searchLower) ||
            material.filename.toLowerCase().includes(searchLower)
        )
      );
    }

    return true;
  });

  const totalMaterials = courses.reduce(
    (total, course) => total + course.materials.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" max-w-5xl mx-auto">
        {/* Header */}
        <div className=" border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Materials Management
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage course materials and resources
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddMaterial}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search materials or courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    <option value="">All Courses</option>
                    {allCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Materials</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalMaterials}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">
                    Courses with Materials
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Materials List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Loading materials...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No materials found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by adding your first material
                  </p>
                  <button
                    onClick={handleAddMaterial}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Material
                  </button>
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Course Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleCourseExpansion(course._id)}
                    >
                      <div className="flex items-center">
                        {expandedCourses.has(course._id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {course.materials.length} material
                          {course.materials.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Materials List */}
                    {expandedCourses.has(course._id) && (
                      <div className="divide-y divide-gray-200">
                        {course.materials.map((material) => (
                          <div
                            key={material.bunnyFileId}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center flex-1">
                                <div className="mr-3">
                                  {getTypeIcon(material.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-medium text-gray-900 truncate">
                                      {material.title}
                                    </h4>
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(
                                        material.type
                                      )}`}
                                    >
                                      {material.type.toUpperCase()}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{material.filename}</span>
                                    {material.createdAt && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          Added{" "}
                                          {new Date(
                                            material.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() =>
                                    window.open(material.url, "_blank")
                                  }
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Material"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleEditMaterial(material, course._id)
                                  }
                                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteMaterial(
                                      course._id,
                                      material.bunnyFileId
                                    )
                                  }
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Material Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {editingMaterial ? "Edit Material" : "Add New Material"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingMaterial(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          courseId: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      required
                      disabled={!!editingMaterial}
                    >
                      <option value="">Select a course</option>
                      {allCourses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                    {editingMaterial && (
                      <p className="text-sm text-gray-500 mt-1">
                        Course cannot be changed when editing
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Enter material title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Type *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["pdf", "image", "document"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, type }))
                          }
                          className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                            formData.type === type
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {getTypeIcon(type)}
                          <span className="capitalize font-medium">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Upload{" "}
                      {editingMaterial
                        ? "(Optional - leave empty to keep current file)"
                        : "*"}
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      accept={
                        formData.type === "pdf"
                          ? ".pdf"
                          : formData.type === "image"
                          ? "image/*"
                          : "*"
                      }
                      required={!editingMaterial}
                    />
                    {uploadProgress > 0 && (
                      <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {uploadProgress}% uploaded
                        </p>
                      </div>
                    )}
                    {editingMaterial && !selectedFile && (
                      <p className="text-sm text-gray-500 mt-1">
                        Current file: {editingMaterial.material.filename}
                      </p>
                    )}
                  </div>

                  {formData.type === "document" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (Optional)
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        rows={4}
                        placeholder="Enter document content or description"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingMaterial(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {formLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {editingMaterial ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingMaterial ? "Update Material" : "Add Material"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsManagement;
