import { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, X } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    services: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 opacity-50 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent animate-pulse"></div>
        <div
          className="w-full h-full opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridSlide 20s linear infinite',
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto z-60 pt-20 sm:pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Contact our team</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Got any questions about the product or scaling on our platform? We're here to help.
          </p>
          <p className="text-base sm:text-lg text-gray-600">
            Chat to our friendly team 24/7 and get onboard in less than 5 minutes.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* Form Section */}
          <div className="lg:col-span-2 w-full">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 sm:p-8 w-full">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    aria-label="First name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    required
                    aria-label="Last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  required
                  aria-label="Email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <div className="flex w-full">
                  <select
                    className="px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Country code"
                  >
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                    <option value="AU">AU</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    aria-label="Phone number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Leave us a message..."
                  rows={5}
                  required
                  aria-label="Message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                ></textarea>
              </div>

              {/* Services */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-4">Services</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Website design',
                    'Content creation',
                    'UX design',
                    'Strategy & consulting',
                    'User research',
                    'Other',
                  ].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceChange(service)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        aria-label={`Select ${service}`}
                      />
                      <span className="ml-3 text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6 w-full">
            {/* Chat with us */}
            <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with us</h3>
              <p className="text-gray-600 text-sm mb-4">Speak to our friendly team via live chat.</p>
              <div className="space-y-3">
                <button
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                  aria-label="Start a live chat"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start a live chat
                </button>
                <button
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                  aria-label="Send an email"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Shoot us an email
                </button>
                <button
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                  aria-label="Message us on X"
                >
                  <X className="h-4 w-4 mr-2" />
                  Message us on X
                </button>
              </div>
            </div>

            {/* Call us */}
            <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Call us</h3>
              <p className="text-gray-600 text-sm mb-4">Call our team Mon-Fri from 8am to 5pm.</p>
              <button
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                aria-label="Call us at +1 (555) 000-0000"
              >
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 000-0000
              </button>
            </div>

            {/* Visit us */}
            <div className="bg-white rounded-lg shadow-sm border p-6 w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit us</h3>
              <p className="text-gray-600 text-sm mb-4">Chat to us in person at our Melbourne HQ.</p>
              <button
                className="flex items-start text-sm text-gray-700 hover:text-blue-600 transition-colors w-full text-left"
                aria-label="Visit us at 100 Smith Street, Collingwood VIC 3066"
              >
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="underline">100 Smith Street, Collingwood VIC 3066</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}