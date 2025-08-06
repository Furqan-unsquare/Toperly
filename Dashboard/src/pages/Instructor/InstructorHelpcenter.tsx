import React, { useState } from 'react';
import { Search, Eye, EyeOff, HelpCircle, MessageCircle, Mail } from 'lucide-react';

const HerokuHelpCenter = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className=" border-b border-gray-200 px-6 py-4 max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900">Help Center</h1>
        <p className="text-sm text-gray-600 mt-1">
          Access guides, FAQs, and support for projects, tasks, customizations, and troubleshooting in Herokudesk.
        </p>
        
        {/* Search Bar */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ask a question or search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* Login Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Login</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="admin.team@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h2>
              <p className="text-sm text-gray-600 mb-4">
                Everything you need to set up your Herokudesk account and start managing projects effectively.
              </p>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Theme</h3>
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 bg-gray-800 rounded border-2 border-purple-500 mb-2 flex items-center justify-center">
                      <div className="w-8 h-6 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-xs text-gray-600">Light Mode</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-12 bg-gray-200 rounded border mb-2 flex items-center justify-center">
                      <div className="w-8 h-6 bg-gray-400 rounded-sm"></div>
                    </div>
                    <span className="text-xs text-gray-600">Default</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customizing Your Workspace */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Customizing Your Workspace</h2>
              <p className="text-sm text-gray-600 mb-4">
                Personalize your Herokudesk environment to match your workflow and preferences.
              </p>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Content Review and Feedback</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm text-gray-600">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">AI</span>
                </div>
                <span className="text-sm text-gray-600">AI Assistant</span>
              </div>
            </div>

            {/* Reports & Analytics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Reports & Analytics</h2>
              <p className="text-sm text-gray-600 mb-4">
                Track performance and generate reports to analyze project and team productivity.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">Why can't I log into my account?</span>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">How do I reset my password?</span>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* FAQs & Troubleshooting */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">FAQs & Troubleshooting</h2>
              <p className="text-sm text-gray-600">
                Quick answers to common questions and solutions to common problems.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h2>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Design System Creation</h3>
                  <p className="text-xs text-gray-600">Annual Report for New Organization</p>
                </div>
                <button className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center">
                  <span className="text-xs">×</span>
                </button>
              </div>
            </div>

            {/* Managing Projects & Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Managing Projects & Tasks</h2>
              <p className="text-sm text-gray-600">
                Expert guides to help you effectively manage projects and collaborate with your team.
              </p>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Password</h2>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Security */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Account & Security</h2>
              <p className="text-sm text-gray-600 mb-4">
                Manage your account settings and ensure your data stays secure.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">S</span>
                    </div>
                    <span className="text-sm text-gray-700">Slack</span>
                  </div>
                  <button className="px-3 py-1 bg-gray-800 text-white text-xs rounded">Connect</button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs">G</span>
                    </div>
                    <span className="text-sm text-gray-700">Google Calendar</span>
                  </div>
                  <button className="px-3 py-1 bg-gray-800 text-white text-xs rounded">Connect</button>
                </div>
              </div>
            </div>

            {/* Integrations & Add-Ons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Integrations & Add-Ons</h2>
              <p className="text-sm text-gray-600 mb-4">
                Connect Herokudesk with external tools to streamline workflow and improve collaboration.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Email Support</h3>
                    <p className="text-xs text-gray-600">Contact us at support@herokudesk.com for help</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">Live Chat</h3>
                    <p className="text-xs text-gray-600">Get instant support agent in real-time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h2>
              <p className="text-sm text-gray-600">
                Get help directly from our support team when you need assistance beyond the Help Center.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HerokuHelpCenter;