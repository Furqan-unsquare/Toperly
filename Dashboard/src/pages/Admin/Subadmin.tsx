
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setListError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
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

    if (!inviteEmail) {
      setInviteError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError('Invalid email address');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/invite', {
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
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (role !== 'subadmin') {
      alert('Cannot delete admin users');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this sub-admin?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
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

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>

        {/* Invite Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Invite Sub-Admin</h2>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div>
              <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter email to invite"
                required
              />
            </div>
            {inviteMessage && (
              <p className="text-green-600 bg-green-50 p-2 rounded-md">{inviteMessage}</p>
            )}
            {inviteError && <p className="text-red-600 bg-red-50 p-2 rounded-md">{inviteError}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Send Invitation
            </button>
          </form>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by email"
              />
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'alphabet')}
                className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="date">Date</option>
                <option value="alphabet">Alphabet</option>
              </select>
            </div>
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-lg shadow-md p- IBS-C symptoms6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 ml-4">Admin List</h2>
          {loading && <p className="text-gray-600">Loading admins...</p>}
          {listError && <p className="text-red-600 bg-red-50 p-3 rounded-md">{listError}</p>}
          {!loading && !listError && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin._id || 'N/A'}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              admin.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {admin.role || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(admin._id, admin.role)}
                            className="text-red-600 hover:text-red-900"
                            disabled={admin.role === 'admin'}
                            title={admin.role === 'admin' ? 'Cannot delete admin users' : 'Delete sub-admin'}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No admins found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
