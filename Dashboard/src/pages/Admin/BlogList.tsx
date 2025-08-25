import { useState, useEffect } from 'react';
import BlogForm from './BlogForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, X, Plus, Eye, Calendar, Clock, BookOpen, User, IndianRupee, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_BASE = `${import.meta.env.VITE_API_URL}/api/blogs`;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
    setConfirmMessage('Are you sure you want to delete this blog? This action cannot be undone.');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Create and manage blog posts for your platform</p>
        </div>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Add New Blog
        </Button>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingBlog(null);
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingBlog ? 'Update your blog post details' : 'Fill in the details to create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          <BlogForm onSubmit={handleSubmit} initialData={editingBlog || {}} isEditing={!!editingBlog} />
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Action
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">{confirmMessage}</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirm} variant={confirmMessage.includes('delete') ? "destructive" : "default"}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48 rounded-none" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-20 mr-2" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first blog post</p>
          <Button onClick={startCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Blog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog._id} className="overflow-hidden border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
              {blog.image && (
                <div className="relative">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">
                    {blog.category}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                <CardDescription className="line-clamp-2">{blog.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(blog.createdAt)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    {blog.price}
                  </Badge>
                  {blog.readTime && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {blog.readTime} min read
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Author:</span> 
                    <span>{blog.author?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Course:</span> 
                    <span>{blog.course || 'General'}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-3">{blog.content.substring(0, 150)}...</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => startEdit(blog)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(blog._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}