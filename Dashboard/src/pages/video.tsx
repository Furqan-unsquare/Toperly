import React, { useState, useEffect } from "react";
import {
  Upload,
  Play,
  Eye,
  Download,
  Users,
  FileImage,
  Video,
  Plus,
  X,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import Media from "./media";

const MediaManagementSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock authentication
  const authenticate = (role) => {
    setCurrentUser({
      name: role === "admin" ? "Admin User" : "Student User",
      role,
    });
    setUserRole(role);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://192.168.1.29:5000/unsquare-toperly/images",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          const formatted = data.data.map((file) => ({
            id: file.filename,
            name: file.filename,
            type: file.filename.endsWith(".mp4") ? "video" : "image",
            url: file.url,
            thumbnail: file.url,
            uploadDate: file.lastModified?.split("T")[0] || "Unknown",
            size: file.size
              ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
              : "N/A",
          }));

          setMediaItems(formatted);
        } else {
          console.error(data.message || "Failed to fetch media");
        }
      } catch (err) {
        console.error("Error fetching BunnyCDN files:", err.message);
      }
    };

    fetchMedia();
  }, []);

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://192.168.1.29:5000/api/url/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const newMedia = {
          id: Date.now(),
          name: file.name,
          type: file.type.startsWith("video") ? "video" : "image",
          url: data.data.url,
          thumbnail: data.data.url,
          uploadDate: new Date().toISOString().split("T")[0],
          size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        };

        setMediaItems((prev) => [newMedia, ...prev]);
      } else {
        console.error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err.message);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const openMediaModal = (media) => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Media Portal
            </h1>
            <p className="text-gray-600">Choose your access level</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => authenticate("admin")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Shield className="w-5 h-5" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Upload Section */}
        {userRole === "admin" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Media</h2>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />

              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-gray-500">Supports images and videos</p>
              </label>

              {isUploading && (
                <div className="mt-6">
                  <div className="bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {showModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedMedia.name}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-auto max-h-[60vh] rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Uploaded: {selectedMedia.uploadDate}</p>
                  <p>Size: {selectedMedia.size}</p>
                </div>

                <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Media />
    </div>
  );
};

export default MediaManagementSystem;
