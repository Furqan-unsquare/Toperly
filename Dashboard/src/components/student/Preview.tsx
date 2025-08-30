import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  title: string;
  description: string;
  url: string;
  bunnyFileId: string;
  duration: number;
  order: number;
  _id: string;
  chapters: any[];
}

interface CourseData {
  videos: Video[];
  thumbnail: {
    url: string;
  };
}

export const Preview = () => {
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/courses/68b14c6a2f78780ff44e1443`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const data = await response.json();
        setCourseData(data);
      } catch (err) {
        setError("Error loading video. Please try again later.");
      }
    };

    fetchCourseData();
  }, [API_BASE]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-6 border-0 shadow-sm">
        <CardContent className="p-6">
          <p className="text-red-600 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!courseData) {
    return (
      <Card className="max-w-4xl mx-auto border-0 shadow-sm">
          <Skeleton className="w-full h-96" />
          <div className="flex justify-center mt-4">
            <Skeleton className="h-10 w-10" />
          </div>
      </Card>
    );
  }

  // Get the first video
  const firstVideo = courseData.videos[0];

  return (
    <Card className="mx-auto border-0 shadow-sm">
      <div className="relative w-full max-h-88 overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          src={firstVideo.url}
          poster={courseData.thumbnail.url}
          className="w-full h-full object-cover max-h-88"
          muted
          onEnded={handleVideoEnd}
          onClick={togglePlay}
        />
        
        {/* Play button overlay - only shown when video is paused/not playing */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity hover:bg-black/40"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full border flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Play className="h-8 w-8 text-gray-200 ml-1" />
            </div>
          </div>
        )}
        
        {/* Pause button - shown when video is playing */}
        {isPlaying && (
          <div 
            className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2 cursor-pointer transition-opacity hover:bg-black/70"
            onClick={togglePlay}
          >
            <Pause className="h-6 w-6 " />
          </div>
        )}
      </div>
    </Card>
  );
};