
import { useState, useEffect } from 'react';
import BlogForm from './BlogForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash2, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const { toast } = useToast();
  const API_BASE = 'http://localhost:5000/api/blogs';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blogs. Please try again.',
        variant: 'destructive',
      });
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setConfirmMessage(editingBlog ? 'Are you sure you want to update this blog?' : 'Are you sure you want to create this blog?');
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(editingBlog ? `${API_BASE}/${editingBlog._id}` : API_BASE, {
          method: editingBlog ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save blog');
        }
        const savedBlog = await response.json();

        setBlogs((prev) =>
          editingBlog
            ? prev.map((b) => (b._id === savedBlog._id ? savedBlog : b))
            : [...prev, savedBlog]
        );

        toast({
          title: 'Success',
          description: editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!',
        });

        setShowForm(false);
        setEditingBlog(null);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to save blog. Please try again.',
          variant: 'destructive',
        });
        console.error('Save error:', error);
      }
    });
    setShowConfirm(true);
  };

  const handleDelete = async (id) => {
    setConfirmMessage('Are you sure you want to delete this blog?');
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete blog');
        }

        setBlogs((prev) => prev.filter((b) => b._id !== id));
        toast({
          title: 'Success',
          description: 'Blog deleted successfully!',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete blog. Please try again.',
          variant: 'destructive',
        });
        console.error('Delete error:', error);
      }
    });
    setShowConfirm(true);
  };

  const startEdit = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) await confirmAction();
    setShowConfirm(false);
    setConfirmAction(null);
  };

  return (
    <div className="container max-w-6xl mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>

      <Button onClick={startCreate} className="mb-8">Add New Blog</Button>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
          </DialogHeader>
          <BlogForm onSubmit={handleSubmit} initialData={editingBlog || {}} isEditing={!!editingBlog} />
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p>{confirmMessage}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Card key={blog._id} className="overflow-hidden">
            {blog.image && (
              <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
            )}
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription>{blog.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Category:</strong> {blog.category}</p>
              {/* <p><strong>Read Time:</strong> {blog.readTime || 'N/A'}</p> */}
              <p><strong>Course:</strong> {blog.course}</p>
              <p><strong>Price:</strong> ₹{blog.price}</p>
              <p><strong>Author:</strong> {blog.author?.email || 'N/A'}</p>
              <p className="mt-2">{blog.content.substring(0, 100)}...</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => startEdit(blog)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(blog._id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
