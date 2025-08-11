import React from 'react';

const BlogCard = ({ blog, onClick }) => (
  <div
    className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
    onClick={onClick}
  >
    {/* Top Image */}
    <div className="relative h-44 w-full px-4 pt-4 rounded-xl overflow-hidden">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover rounded-xl"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }} // Fallback image
      />
      {/* Category Badge */}
      <div className="absolute top-5 left-5">
        <span className="
          bg-white text-gray-800 font-semibold
          border border-gray-200 uppercase
          rounded-sm px-3 py-1 text-xs
          shadow
          ">{blog.category || 'Uncategorized'}</span>
      </div>
    </div>
    {/* Content */}
    <div className="flex flex-col flex-1 p-5">
      {/* Meta: date & read time */}
      <div className="flex gap-3 text-xs text-gray-400 font-medium mb-2">
        <span>{blog.date || 'N/A'}</span>
        <span className="h-1 w-1 rounded-full bg-gray-200 inline-block mt-1" />
        <span>{blog.readTime || 'N/A'}</span>
      </div>
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
        {blog.title || 'Untitled'}
      </h3>
      {/* Description */}
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
        {blog.description || 'No description available'}
      </p>
      {/* Author & Read */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {/* Author avatar with initial */}
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 border font-bold text-base">
            {blog.author && blog.author.length > 0 ? blog.author[0].toUpperCase() : 'U'}
          </span>
          <span className="text-sm font-medium text-gray-700">{blog.author || 'Unknown Author'}</span>
        </div>
        <button className="
          border bg-gradient-primary hover:shadow-glow-primary text-white
          px-4 py-1.5 rounded-full font-semibold text-xs
          hover:bg-purple-600 hover:text-white transition-all">
          Read
        </button>
      </div>
    </div>
  </div>
);

export default BlogCard;