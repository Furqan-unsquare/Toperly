import React from 'react';
import { ChevronLeft } from 'lucide-react';

const BlogDetailPage = ({ blog, onBack }) => (
  <div className="max-w-6xl mx-auto pb-10 px-4">
    <button
      onClick={onBack}
      className="flex items-center gap-1 text-purple-700 font-semibold mb-6"
    >
      <ChevronLeft className="w-4 h-4" />
      Back to Blog
    </button>
    <div className="rounded-2xl overflow-hidden bg-white">
      {/* Cover image */}
      <img src={blog.image} alt={blog.title} className="w-full rounded-xl h-60 object-cover" />
      {/* Inner */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">{blog.category}</span>
          <span className="text-xs text-gray-400">{blog.date}</span>
          <span className="text-xs text-gray-400">&middot; {blog.readTime}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 border flex items-center justify-center text-lg font-semibold">
            {blog.author[0]}
          </div>
          <span className="text-base font-medium text-gray-700">{blog.author}</span>
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  </div>
);

export default BlogDetailPage;
