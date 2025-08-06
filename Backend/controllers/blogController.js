import Blog from '../models/Blog.js';

export const createBlog = async (req, res) => {
  try {
    const { title, description, category, image, readTime, content, course, price } = req.body;
    const blog = new Blog({
      title,
      description,
      category,
      image,
      readTime,
      content,
      course,
      price,
      author: req.admin._id
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'email');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, description, category, image, readTime, content, course, price } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.image = image || blog.image;
    blog.readTime = readTime || blog.readTime;
    blog.content = content || blog.content;
    blog.course = course || blog.course;
    blog.price = price !== undefined ? price : blog.price;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
