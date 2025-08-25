import React, { useState, useEffect } from 'react';
import { Trash2, Search, Filter, UserPlus, Mail, User, Shield, Calendar, AlertTriangle, Loader, CheckCircle } from 'lucide-react';

interface Admin {
  _id: string;
  email: string;
  role: 'admin' | 'subadmin';
  createdAt: string;
}

const AdminDashboard = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'alphabet'>('date');
  const [isInviting, setIsInviting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{id: string, email: string, role: string} | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAdmins();
  }, []); 

  const fetchAdmins = async () => {
    setLoading(true);
    setListError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch admins');
      }
      const data = await response.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'An error occurred while fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMessage('');
    setInviteError('');
    setIsInviting(true);

    if (!inviteEmail) {
      setInviteError('Email is required');
      setIsInviting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError('Invalid email address');
      setIsInviting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail, role: 'subadmin' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send invitation');

      setInviteMessage('Invitation sent successfully');
      setInviteEmail('');
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'An error occurred while sending invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const confirmDelete = (admin: Admin) => {
    if (admin.role !== 'subadmin') {
      return;
    }
    setAdminToDelete({
      id: admin._id,
      email: admin.email,
      role: admin.role
    });
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    
    setDeletingId(adminToDelete.id);
    setShowDeleteConfirm(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/users/${adminToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sub-admin');
      }
      fetchAdmins();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred while deleting sub-admin');
    } finally {
      setDeletingId(null);
      setAdminToDelete(null);
    }
  };

  // Filter and sort admins
  const filteredAdmins = admins
    .filter((admin) =>
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Default: Descending (newest first)
      } else {
        return (a.email || '').localeCompare(b.email || ''); // Default: Ascending (A-Z)
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return ( 
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage administrators and sub-administrators</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            <span>Admin</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Invite Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Invite Sub-Admin</h2>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              {inviteMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{inviteMessage}</span>
                </div>
              )}
              
              {inviteError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isInviting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isInviting ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Send Invitation
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Admins</span>
                <span className="font-semibold text-gray-900">{admins.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Sub-Admins</span>
                <span className="font-semibold text-gray-900">
                  {admins.filter(a => a.role === 'subadmin').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Admins</span>
                <span className="font-semibold text-gray-900">
                  {admins.filter(a => a.role === 'admin').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Admins
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'alphabet')}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="date">Date Added</option>
                  <option value="alphabet">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <User className="h-6 w-6 mr-2 text-gray-600" />
              Admin List
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : listError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>{listError}</span>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search query' : 'Get started by inviting a sub-admin'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{admin.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              admin.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {admin.role === 'admin' ? 'Administrator' : 'Sub-Admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {admin.createdAt ? formatDate(admin.createdAt) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => confirmDelete(admin)}
                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                            disabled={admin.role === 'admin' || deletingId === admin._id}
                            title={admin.role === 'admin' ? 'Cannot delete admin users' : 'Delete sub-admin'}
                          >
                            {deletingId === admin._id ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && adminToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Sub-Admin</h3>
            </div>
            <p className="text-gray-700 mb-2">Are you sure you want to delete this sub-admin?</p>
            <p className="text-gray-700 font-medium mb-4">{adminToDelete.email}</p>
            <p className="text-red-600 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAdminToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;