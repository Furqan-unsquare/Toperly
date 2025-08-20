import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function BlogForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    image: initialData.image || '',
    readTime: initialData.readTime || '',
    content: initialData.content || '',
    course: initialData.course || '',
    price: initialData.price || 0,
  });
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.content || !formData.course || formData.price < 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-h-[70vh] overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Short Description" required rows={4} />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
        </div>
        <div>
          <Label htmlFor="readTime">Read Time</Label>
          <Input id="readTime" name="readTime" value={formData.readTime} onChange={handleChange} placeholder="5 min" />
        </div>
        <div>
          <Label htmlFor="course">Course</Label>
          <Input id="course" name="course" value={formData.course} onChange={handleChange} placeholder="Related Course" required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0" min="0" required />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="Blog Content" rows={8} required />
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">
        {isEditing ? 'Update Blog' : 'Create Blog'}
      </Button>
    </form>
  );
}
