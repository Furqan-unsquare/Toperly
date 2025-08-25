import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const App = () => {
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect, user } = useAuth0();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  
  const API_URL = `${import.meta.env.VITE_API_URL}/api/instructors`;

  // Check if user is admin
  const checkAdminStatus = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setIsAdminUser(true);
      }
    } catch (err) {
      setIsAdminUser(false);
    }
  };

  // Fetch all instructors
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) throw new Error(response.data.message);
      setInstructors(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update verification status
  const updateVerification = async (id, isVerified) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${API_URL}/verification/${id}`,
        { isVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.success) throw new Error(response.data.message);
      setInstructors(
        instructors.map((instructor) =>
          instructor._id === id ? { ...instructor, isVerified: response.data.data.isVerified } : instructor
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminStatus();
      fetchInstructors();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Instructor Management Dashboard</h1>
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Instructor Management Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Bio</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Expertise</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Verification</th>
                {isAdminUser && (
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{instructor.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{instructor.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{instructor.bio || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {instructor.expertise.join(', ') || 'N/A'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={instructor.isVerified ? 'text-green-600' : 'text-red-600'}>
                      {instructor.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                  {isAdminUser && (
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => updateVerification(instructor._id, !instructor.isVerified)}
                        className={`px-4 py-1 rounded text-white ${
                          instructor.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {instructor.isVerified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;