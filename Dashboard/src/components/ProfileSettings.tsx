import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  User, 
  MapPin, 
  Mail, 
  MoreHorizontal,
  Briefcase,
  CreditCard,
  Edit,
  Save,
  X
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    expertise: [],
    password: '',
    payoutDetails: {
      razorpayAccountId: '',
      preferredMethod: 'bank_transfer'
    }
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    const response = await fetch('http://localhost:5000/api/auth/me', {
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

    // ✅ use profile from API response
    const data = responseData.profile;

    setProfileData(data);
    setEditForm({
      bio: data.bio || '',
      expertise: data.expertise || [],
      password: '',
      payoutDetails: {
        razorpayAccountId: data.payoutDetails?.razorpayAccountId || '',
        preferredMethod: data.payoutDetails?.preferredMethod || 'bank_transfer'
      }
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (editForm.password && editForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setError(null);
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:5000/api/instructors/me', {
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

      const { data } = await response.json();
      setProfileData(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('payoutDetails.')) {
      const field = name.split('.')[1];
      setEditForm({
        ...editForm,
        payoutDetails: {
          ...editForm.payoutDetails,
          [field]: value
        }
      });
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      });
    }
  };

  const handleExpertiseChange = (e) => {
    const expertiseArray = e.target.value.split(',').map(item => item.trim()).filter(item => item);
    setEditForm({
      ...editForm,
      expertise: expertiseArray
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

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
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div>
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            {profileData?.name}
                          </h1>
                          <p className="text-lg text-gray-600 mt-1">{profileData?.role}</p>
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

                        {/* Dropdown Menu */}
                        <div className="relative mt-4 sm:mt-0">
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setIsEditing(!isEditing);
                                  setIsDropdownOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                              </button>
                            </div>
                          )}
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

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About me</h3>
                      {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                              name="bio"
                              value={editForm.bio}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows="4"
                              placeholder="Tell us about yourself"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Expertise (comma-separated)</label>
                            <input
                              type="text"
                              name="expertise"
                              value={editForm.expertise.join(', ')}
                              onChange={handleExpertiseChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="e.g., MERN, UI/UX, JavaScript"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                              type="password"
                              name="password"
                              value={editForm.password}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter new password (minimum 6 characters)"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </button>
                          </div>
                          {error && <p className="text-red-600 text-sm">{error}</p>}
                        </form>
                      ) : (
                        <p className="text-gray-600 leading-relaxed mb-4">{profileData?.bio || 'No bio provided'}</p>
                      )}
                    </div>

                    {/* Payment Details Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Razorpay Account ID</label>
                            <input
                              type="text"
                              name="payoutDetails.razorpayAccountId"
                              value={editForm.payoutDetails.razorpayAccountId}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter Razorpay Account ID"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Preferred Payment Method</label>
                            <select
                              name="payoutDetails.preferredMethod"
                              value={editForm.payoutDetails.preferredMethod}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              <option value="bank_transfer">Bank Transfer</option>
                              <option value="paypal">PayPal</option>
                              <option value="stripe">Stripe</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <span className="font-medium">Razorpay Account ID:</span>{' '}
                            {profileData?.payoutDetails?.razorpayAccountId || 'Not set'}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Preferred Method:</span>{' '}
                            {profileData?.payoutDetails?.preferredMethod || 'Not set'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;