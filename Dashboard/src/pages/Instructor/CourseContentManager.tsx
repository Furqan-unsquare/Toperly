// components/admin/CourseContentForms.jsx
import React from 'react';
import RequirementsForm from '../../components/instructor/RequirementsForm';
import LearningPointsForm from '@/components/Course/LearningPointsForm';

const CourseContentForms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 ">
        
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Content Management
          </h1> 
          <p className="text-md text-gray-600">
            Manage learning objectives and requirements for your courses. 
            Use the forms below to add or update course content.
          </p>
        </div>

        {/* Forms Container */}
        <div className="space-y-8">
          
          {/* Learning Points Form */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Learning Objectives Management
              </h2>
              <p className="text-gray-600 ml-11">
                Define what students will learn from this course
              </p>
            </div>
            <LearningPointsForm />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gray-50 text-sm text-gray-500 font-medium">
                AND
              </span>
            </div>
          </div>

          {/* Requirements Form */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Requirements Management
              </h2>
              <p className="text-gray-600 ml-11">
                Set the prerequisites and requirements for this course
              </p>
            </div>
            <RequirementsForm />
          </div>

        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Pro Tip
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Both forms work independently. You can update learning objectives and requirements 
                  for the same course separately or together. Changes are saved immediately when you 
                  click the respective save buttons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentForms;
