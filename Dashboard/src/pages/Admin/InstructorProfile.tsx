import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Mail
} from 'lucide-react';
import InstructorStudent from './InstructorStudent';

const InstructorProfile = () => {
  const { id } = useParams(); // Get instructor _id from URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id, API_BASE]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

       const response = await fetch(`${API_BASE}/api/instructors/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data; // Use 'data' field from API response

      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchProfileData}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto flex max-w-5xl">
      <div className="flex-1">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800"></div>
          
          {/* Profile Section */}
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative -mt-20 pb-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={profileData?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face'}
                        alt={profileData?.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                      />
                      {profileData?.isVerified && (
                        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center">
                          <img src="https://static.vecteezy.com/system/resources/previews/028/084/126/original/verified-check-mark-icon-png.png" alt="Verified" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                          {profileData?.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profileData?.customId}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${profileData?.email}`} className="text-blue-600 hover:underline">
                              {profileData?.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'about'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  About me
                </button>
              </nav>
            </div>
            <div>
             
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About me</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{profileData?.bio || 'No bio provided'}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData?.expertise?.length > 0 ? (
                          profileData.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-600">No expertise listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
               <InstructorStudent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;