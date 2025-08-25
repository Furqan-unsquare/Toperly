import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../../../LandingPage/components/Blog/BlogCard';
import BlogDetailPage from '../../../LandingPage/components/Blog/DetailBlogs';
import FilterSidebar from '../../../LandingPage/components/Blog/FilterSidebar';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [sortOption, setSortOption] = useState("latest");
  const [selectedBlog, setSelectedBlog] = useState(null);
const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState('');

  // Fetch blogs from API
useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      console.log('Raw API Response:', response.data);
      
      // Check if response.data is an array
      if (!Array.isArray(response.data)) {
        console.error('API response is not an array:', response.data);
        setError('Invalid data format from API');
        return;
      }
      
      // Log first blog item to see structure
      if (response.data.length > 0) {
        console.log('First blog item:', response.data[0]);
      }
      
      const mappedBlogs = response.data.map(blog => {
        console.log('Mapping blog:', blog); // Debug each blog
        return {
          id: blog._id,
          title: blog.title || 'Untitled',
          description: blog.description || 'No description',
          category: blog.category || 'Uncategorized',
          image: blog.image || 'https://via.placeholder.com/400x250',
          author: blog.author?.email || blog.author || 'Unknown Author',
          date: blog.date || new Date().toISOString().split('T')[0],
          readTime: blog.readTime || '5 min read',
          content: blog.content || '',
          course: blog.course || 'General',
          price: blog.price || 0
        };
      });
      
      console.log('Mapped Blogs:', mappedBlogs);
      setBlogs(mappedBlogs);
    } catch (err) {
      console.error('Full error:', err);
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };
  fetchBlogs();
}, []);


  // Generate courses list dynamically
  const coursesList = useMemo(() => {
    console.log('Courses List Computation:', blogs.map(blog => blog.course)); // Log courses
    return [...new Set(blogs.map(blog => blog.course))].sort();
  }, [blogs]);

  // Handle course checkbox toggle
  const onCourseChange = (course) => {
    setSelectedCourses((prev) =>
      prev.includes(course)
        ? prev.filter((c) => c !== course)
        : [...prev, course]
    );
  };

  // Filter and sort blogs
const filteredAndSortedBlogs = useMemo(() => {
  console.log('=== FILTERING DEBUG ===');
  console.log('Total blogs:', blogs.length);
  console.log('Selected courses:', selectedCourses);
  console.log('Sort option:', sortOption);
  
  let filtered = [...blogs];

  // ONLY filter by courses (remove price filtering entirely)
  if (selectedCourses.length > 0) {
    const beforeCount = filtered.length;
    filtered = filtered.filter((blog) => {
      const passes = selectedCourses.includes(blog.course);
      console.log(`Course filter: "${blog.title}" course="${blog.course}" passes=${passes}`);
      return passes;
    });
    console.log(`Course filter: ${beforeCount} → ${filtered.length}`);
  } else {
    console.log('No course filter applied (selectedCourses is empty)');
  }

  // Sorting
  switch (sortOption) {
    case "latest":
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "oldest":
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "titleAZ":
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "titleZA":
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  console.log(`Final filtered blogs: ${filtered.length}`);
  console.log('Final blogs:', filtered.map(b => b.title));
  return filtered;
}, [blogs, selectedCourses, sortOption]); // Remove priceRange from dependencies


  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-8 md:mt-32">
      {/* Sidebar: only show if no blog selected */}
      {!selectedBlog && (
        <aside className="w-full md:w-72 sticky md:top-16 self-start">
          <FilterSidebar
            courses={coursesList}
            selectedCourses={selectedCourses}
            onCourseChange={onCourseChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
  {loading && <p>Loading blogs...</p>}
  {error && <p className="text-red-500 mb-4">{error}</p>}
  {!loading && selectedBlog ? (
    <BlogDetailPage blog={selectedBlog} onBack={() => setSelectedBlog(null)} />
  ) : !loading && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredAndSortedBlogs.length > 0 ? (
        filteredAndSortedBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onClick={() => setSelectedBlog(blog)} />
        ))
      ) : (
        <p className="text-gray-500">No blogs available. Total blogs: {blogs.length}</p>
      )}
    </div>
  )}
</main>
    </div>
  );
};

export default BlogListPage;
