// components/EnrolledStudents/SummaryPanel.tsx
import React from 'react';

const SummaryPanel = ({ studentsData }: { studentsData: any[] }) => {
  const totalStudents = new Set(studentsData.map(s => s.student._id)).size;
  const totalCourses = new Set(studentsData.map(s => s.course._id)).size;
  const averageProgress = (
    studentsData.reduce((acc, cur) => acc + cur.progress, 0) / studentsData.length
  ).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-lg font-semibold">Total Students</h2>
        <p className="text-2xl text-indigo-600">{totalStudents}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-lg font-semibold">Courses Taught</h2>
        <p className="text-2xl text-green-600">{totalCourses}</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <h2 className="text-lg font-semibold">Avg. Student Progress</h2>
        <p className="text-2xl text-yellow-600">{averageProgress}%</p>
      </div>
    </div>
  );
};

export default SummaryPanel;
