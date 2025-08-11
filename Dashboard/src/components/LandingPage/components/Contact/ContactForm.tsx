import React from 'react';
import { Send, CheckCircle } from 'lucide-react';

const ContactForm = ({ formData, errors, isSubmitted, courses, handleInputChange, handleSubmit }) => {
  return (
    <div className=" bg-[#F9FAFB] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 h-full">
      {/* Photo Section - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 self-stretch">
        <img
          src="https://i.pinimg.com/736x/65/21/08/6521082d186b9accd916445f2565097b.jpg"
          alt="Education"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Start Your Journey Today
          </h2>
          {isSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="+91 12345 67890"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
                  Interested Course *
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${errors.course ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Tell us about your goals and how we can help..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-primary hover:shadow-glow-primary text-white py-4 px-8 rounded-xl font-bold text-lg  transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;