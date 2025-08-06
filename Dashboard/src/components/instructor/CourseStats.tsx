// components/EnrolledStudents/CourseStats.tsx
import React from 'react';

const CourseStats = ({ studentsData }: { studentsData: any[] }) => {
  const stats: Record<string, { title: string; studentCount: number; totalProgress: number }> = {};

  studentsData.forEach(entry => {
    const id = entry.course._id;
    if (!stats[id]) {
      stats[id] = {
        title: entry.course.title,
        studentCount: 0,
        totalProgress: 0
      };
    }
    stats[id].studentCount += 1;
    stats[id].totalProgress += entry.progress;
  });

  return (
    <div className="bg-gray-50 rounded-xl shadow p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Course-wise Performance</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(stats).map(([id, stat]) => (
          <div key={id} className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-indigo-700">{stat.title}</h4>
            <p className="text-sm text-gray-600">Students: {stat.studentCount}</p>
            <p className="text-sm text-gray-600">
              Avg. Progress: {(stat.totalProgress / stat.studentCount).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStats;
