import React, { useEffect, useState, useRef } from 'react';
import { X, Edit2, Trash2, Save, Plus, FileText } from 'lucide-react'; // Removed ChevronDown/Up
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// Define a basic toolbar for ReactQuill
const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'], // Remove formatting
];

const Notes = ({ courseId, token, onClose, isOpen, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editing, setEditing] = useState(false);
  const quillRef = useRef(null);

  // Load notes when opened
  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    } else {
      // Reset UI when closed
      setSelectedId(null);
      setTitle('');
      setDesc('');
      setEditing(false);
    }
  }, [isOpen]);

  const fetchNotes = async () => {
    if (!token) {
      showToast?.('Login to access notes', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/enroll/${courseId}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      let list = data.data || [];
      // Sort by updatedAt descending
      list = list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      setNotes(list);
    } catch (err) {
      console.error('Fetch notes error:', err);
      showToast?.(err.message || 'Failed to load notes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const newNote = () => {
    setSelectedId(null);
    setTitle('');
    setDesc('');
    setEditing(true);
    // Focus editor after render
    setTimeout(() => {
      const editor = quillRef.current?.getEditor?.();
      editor?.focus?.();
    }, 200);
  };

  const startEdit = (note) => {
    setSelectedId(note._id);
    setTitle(note.title || '');
    setDesc(note.desc || '');
    setEditing(true);
    // Focus editor
    setTimeout(() => {
      const editor = quillRef.current?.getEditor?.();
      editor?.focus?.();
    }, 200);
  };

  const cancelEdit = () => {
    if (selectedId) {
      // Revert to original note
      const original = notes.find(n => n._id === selectedId);
      setTitle(original?.title || '');
      setDesc(original?.desc || '');
    } else {
      // Clear for new note
      setSelectedId(null);
      setTitle('');
      setDesc('');
    }
    setEditing(false);
  };

  const save = async () => {
    if (!token) {
      showToast?.('Login to save notes', 'error');
      return;
    }
    if (!title.trim()) {
      showToast?.('Title is required', 'error');
      return;
    }
    setLoading(true);
    try {
      let res, data;
      if (selectedId) {
        // Update existing note
        res = await fetch(`${API_BASE}/enroll/${courseId}/notes/${selectedId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, desc }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Update failed');
        setNotes(prev =>
          prev
            .map(n => (n._id === selectedId ? { ...n, title, desc, updatedAt: new Date().toISOString() } : n))
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        );
        showToast?.('Note updated', 'success');
      } else {
        // Create new note
        res = await fetch(`${API_BASE}/enroll/${courseId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, desc }),
        });
        data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Create failed');
        const newNote = { ...data.data, updatedAt: new Date().toISOString() };
        setNotes(prev =>
          [newNote, ...prev].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        );
        setSelectedId(newNote._id);
        showToast?.('Note saved', 'success');
      }
      setEditing(false);
    } catch (err) {
      console.error('Save note error:', err);
      showToast?.(err.message || 'Failed to save note', 'error');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (idToRemove) => {
    if (!token) {
      showToast?.('Login to delete notes', 'error');
      return;
    }
    if (!idToRemove) return;
    if (!window.confirm('Delete this note?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/enroll/${courseId}/notes/${idToRemove}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setNotes(prev => prev.filter(n => n._id !== idToRemove));
      showToast?.('Note deleted', 'success');
    } catch (err) {
      console.error('Delete note error:', err);
      showToast?.(err.message || 'Failed to delete note', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[350px] bg-white shadow-xl z-1000 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>
          <div className="text-sm text-gray-500 ml-2">{notes.length} note{notes.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={newNote}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
            title="New note"
          >
            <Plus className="w-4 h-4" /> New
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50"
            disabled={loading}
            title="Close"
          >
            <X className="w-5 h-4" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-64px)] overflow-hidden bg-gray-100">
        {editing ? (
          /* Editor - Full width when editing */
          <div className="p-4 h-full overflow-auto">
            <div className="max-w-3xl mx-auto">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 mb-4 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note title"
                disabled={loading}
              />
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="mt-2 mb-4 h-[50vh]">
                <ReactQuill
                  ref={quillRef}
                  value={desc}
                  onChange={setDesc}
                  theme="snow"
                  modules={{ toolbar: toolbarOptions }}
                  className="h-full"
                />
              </div>
              <div className="flex gap-2 mt-20">
                <button
                  onClick={cancelEdit}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={loading}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Notes List - Full width when not editing */
          <div className="h-full overflow-auto p-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="text-center py-12">
                <img
                  src="https://play-lh.googleusercontent.com/K5Y24S5Quijf7yOSgPx8AMmjqlg5vz-jXxbse3DKg-QM3xnUxLwtgr2vDEsEcVSeb2iu"
                  alt="No notes"
                  className="mx-auto mb-4 w-20 h-20 object-cover drop-shadow-sm"
                />
                <h4 className="text-lg font-semibold text-gray-900">No notes added</h4>
                <p className="text-sm text-gray-500 mt-1">Click "New" to create a note.</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-lg mb-2">
                            {note.title || 'Untitled'}
                          </h3>
                          <div className="text-xs text-gray-500 mb-3">
                            {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                          </div>
                          {/* Note content with full HTML rendering */}
                          <div
                            className="prose prose-sm max-w-none text-gray-700"
                            style={{ maxHeight: '200px', overflowY: 'auto' }} // Limit height with scroll if needed
                            dangerouslySetInnerHTML={{
                              __html: note.desc || '<p class="text-gray-500 italic">No description</p>',
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => remove(note._id)}
                            className="p-2 hover:bg-gray-100 rounded text-red-600 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;