import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  User, 
  MapPin, 
  Mail, 
  Save,
  X,
  Trash2,
  Phone,
  Globe,
  Camera,
  Shield,
  AlertTriangle,
  CheckCircle,
  Edit3
} from 'lucide-react';

const AdminProfile = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    language: '',
    password: ''
  });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfileData();
    }
  }, [isAuthenticated, user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.profile;

      setProfileData(data);
      setEditForm({
        name: data.name || '',
        phone: data.phone || '',
        language: data.language || 'en',
        password: ''
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (editForm.password && editForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setError(null);
      const token = await getAccessTokenSilently();
       const response = await fetch(`${API_BASE_URL}/api/students/${profileData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const responseData = await response.json();
      const updatedData = responseData.data;
      setProfileData(updatedData);
      setEditForm({
        name: updatedData.name || '',
        phone: updatedData.phone || '',
        language: updatedData.language || 'en',
        password: ''
      });
      setShowSaveConfirm(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/students/${profileData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      setShowDeleteConfirm(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfileData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="relative">
                <img
                  src={profileData?.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face'}
                  alt={profileData?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {profileData?.name}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1 capitalize">{profileData?.role}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${profileData?.email}`} className="text-blue-600 hover:underline">
                        {profileData?.email}
                      </a>
                    </div>
                    {profileData?.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <Shield className="w-4 h-4 mr-1" />
                    Student Account
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Information
            </button>
          </nav>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Editable
                  </div>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); setShowSaveConfirm(true); }} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={profileData?.email}
                        className="pl-10 w-full rounded-lg border-gray-300 bg-gray-100 py-3 cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        name="language"
                        value={editForm.language}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 appearance-none"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="or">Odia</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>          
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </h3>
              <p className="text-amber-700 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirm Modal */}
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Save className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Changes</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to save these changes to your profile?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveConfirm(false);
                  setEditForm({
                    name: profileData.name || '',
                    phone: profileData.phone || '',
                    language: profileData.language || 'en',
                    password: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
            </div>
            <p className="text-gray-600 mb-2">Are you sure you want to delete your account? This action:</p>
            <ul className="text-gray-600 text-sm list-disc pl-5 mb-6">
              <li>Cannot be undone</li>
              <li>Will permanently erase all your data</li>
              <li>Will cancel any active subscriptions</li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;