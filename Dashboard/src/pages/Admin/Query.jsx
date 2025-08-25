import { useState, useEffect } from 'react';
import { ArrowBigDown, ArrowBigUp, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/query?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}&status=${encodeURIComponent(statusFilter)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data = await response.json();
        setContacts(Array.isArray(data.contacts) ? data.contacts : []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [page, searchTerm, statusFilter, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const onPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/query/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedContact = await response.json();
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, status: updatedContact.status } : contact
        )
      );
      toast({
        title: 'Status Updated',
        description: `Contact status updated to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Update Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg mt-6 overflow-hidden max-w-5xl mx-auto p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex-grow flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search contacts..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under review">Under Review</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="p-4 text-center text-gray-600">Loading...</div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <a href={`tel:${contact.mobile}`} className="hover:underline">
                        {contact.mobile}
                      </a>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <a href={`mailto:${contact.email}`} className="hover:underline">
                        {contact.email}
                      </a>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={contact.status}
                        onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                        disabled={contact.status === 'solved'}
                        className={`border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          contact.status === 'under review' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        } ${contact.status === 'solved' ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <option value="pending" disabled={contact.status === 'solved'}>Pending</option>
                        <option value="under review">Under Review</option>
                        <option value="solved">Solved</option>
                      </select>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm">
                      <div className="flex items-center">
                        {contact.message.length > 10 ? (
                          <>
                            {expandedRow === contact._id ? (
                              <span>{contact.message}</span>
                            ) : (
                              <span>{contact.message.substring(0, 10)}...</span>
                            )}
                            <button
                              onClick={() => toggleExpand(contact._id)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              {expandedRow === contact._id ? <ArrowBigUp size={16} /> : <ArrowBigDown size={16} />}
                            </button>
                          </>
                        ) : (
                          <span>{contact.message}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm hidden lg:table-cell">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-gray-500 text-sm">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && contacts.length > 0 && (
        <div className="px-3 sm:px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">{total}</span> contacts
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTable;