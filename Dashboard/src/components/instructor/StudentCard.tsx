import React, { useEffect, useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, Clock, Play, CheckCircle, Search, Filter, Download, Eye, BarChart3, Calendar } from 'lucide-react';


const StudentCard = ({ data }) => {
  const { student, course, progress, certificateIssued, videoProgress } = data;
  const completedVideos = videoProgress?.filter(vp => vp.completed).length || 0;
  const totalVideos = videoProgress?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {student?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NA'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{student?.name || 'Unknown'}</h3>
            <p className="text-sm text-slate-500">{student?.email}</p>
          </div>
        </div>
        {certificateIssued && (
          <div className="bg-emerald-100 p-2 rounded-full">
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 mb-1">Course</p>
        <p className="text-slate-900">{course?.title || 'Unknown Course'}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Progress</span>
          <span className="text-sm font-semibold text-slate-900">{progress || 0}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-slate-600">
          <Play className="w-4 h-4" />
          <span>{completedVideos}/{totalVideos} videos</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Active</span>
        </div>
      </div>

      {videoProgress && videoProgress.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600 mb-2">Recent Activity</p>
          <div className="space-y-2">
            {videoProgress.slice(0, 2).map((vp, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 truncate">{vp.videoTitle}</span>
                <span className={`font-medium ${vp.completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {vp.progressPercentage?.toFixed(0) || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};