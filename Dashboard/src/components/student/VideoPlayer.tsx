import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Lock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle,
  RotateCcw,
  RotateCw,
  Settings,
  SkipBack,
  SkipForward,
  MessageSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Import AuthContext to get user details
import BotPopup from "../BotPopup";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const AdvancedVideoPlayer = ({
  video,
  isEnrolled,
  course,
  onEnroll,
  enrollmentLoading,
  showToast,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressSaveIntervalRef = useRef(null);
  const hasAutoResumed = useRef(false);

  // Video state management
  const [videoState, setVideoState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    playbackRate: 1,
    quality: "auto",
    isLoading: true,
    error: null,
  });

  // UI state management
  const [uiState, setUiState] = useState({
    showControls: true,
    showSettings: false,
    showQualityMenu: false,
    showSpeedMenu: false,
    showChapters: false,
    showSubtitles: true,
    isDragging: false,
    showVolumeSlider: false,
  });

  // Progress tracking
  const [videoProgress, setVideoProgress] = useState({
    videoTitle: null,
    currentTime: 0,
    duration: 0,
    completed: false,
    progressPercentage: 0,
    lastWatched: null,
    watchTime: 0,
    chaptersCompleted: [],
  });

  // New state for BotPopup
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  // Sample chapters data
  const chapters = [
    { id: 1, title: "Introduction", startTime: 0, endTime: 120 },
    { id: 2, title: "Basic Concepts", startTime: 120, endTime: 300 },
    { id: 3, title: "Advanced Topics", startTime: 300, endTime: 480 },
    { id: 4, title: "Practical Examples", startTime: 480, endTime: 600 },
    { id: 5, title: "Conclusion", startTime: 600, endTime: 720 },
  ];

  // Sample subtitles
  const subtitles = [
    { start: 0, end: 5, text: "Welcome to this comprehensive course" },
    {
      start: 5,
      end: 10,
      text: "Today we'll be learning about advanced concepts",
    },
    { start: 10, end: 15, text: "Let's start with the basics" },
  ];

  const qualityOptions = [
    { label: "Auto", value: "auto", resolution: "Auto" },
    { label: "1080p", value: "1080p", resolution: "1920x1080" },
    { label: "720p", value: "720p", resolution: "1280x720" },
    { label: "480p", value: "480p", resolution: "854x480" },
    { label: "360p", value: "360p", resolution: "640x360" },
  ];

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // 🔧 UTILITY FUNCTIONS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // 💾 PROGRESS MANAGEMENT
  const saveProgress = useCallback(
    (immediate = false) => {
      const videoElement = videoRef.current;
      if (!videoElement || !video?.title || !isEnrolled) return;

      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;

      if (duration > 0 && currentTime >= 0) {
        const progressPercentage = (currentTime / duration) * 100;
        const isCompleted = progressPercentage >= 90;

        const progressData = {
          videoTitle: video.title,
          currentTime,
          duration,
          progressPercentage,
          completed: isCompleted,
          watchTime: videoProgress.watchTime + (immediate ? 0 : 5),
          chaptersCompleted: getCurrentChapterProgress(currentTime),
          quality: videoState.quality,
          playbackRate: videoState.playbackRate,
        };

        const saveAction = () => {
          const blob = new Blob([JSON.stringify(progressData)], {
            type: "application/json",
          });
          const url = `${API_BASE}/enroll/${
            course._id
          }/progress?token=${encodeURIComponent(token)}`;

          const sent = navigator.sendBeacon(url, blob);

          if (sent) {
            setVideoProgress(progressData);
            if (isCompleted && !videoProgress.completed && showToast) {
              showToast("🎉 Video completed! Great job!", "success");
              // Check if popup has not been shown before for this video
              const popupKey = `topsyCompletion_${course._id}_${video.title}`;
              const hasSeenPopup = localStorage.getItem(popupKey);
              if (!hasSeenPopup) {
                setShowCompletionPopup(true);
                localStorage.setItem(popupKey, "true");
              }
            }
          } else {
            // Fallback to fetch if sendBeacon fails
            fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(progressData),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to save progress");
                setVideoProgress(progressData);
                if (isCompleted && !videoProgress.completed && showToast) {
                  showToast("🎉 Video completed! Great job!", "success");
                  // Check if popup has not been shown before for this video
                  const popupKey = `topsyCompletion_${course._id}_${video.title}`;
                  const hasSeenPopup = localStorage.getItem(popupKey);
                  if (!hasSeenPopup) {
                    setShowCompletionPopup(true);
                    localStorage.setItem(popupKey, "true");
                  }
                }
              })
              .catch(() => {
                if (showToast) {
                  showToast("Failed to save progress", "error");
                }
              });
          }
        };

        if (immediate) {
          saveAction();
        } else {
          if (!progressSaveIntervalRef.current) {
            saveAction();
          }
        }
      }
    },
    [
      video?.title,
      course?._id,
      videoProgress.completed,
      videoProgress.watchTime,
      videoState.quality,
      videoState.playbackRate,
      showToast,
      isEnrolled,
    ]
  );

  const loadProgress = useCallback(async () => {
    if (!video?.title || !isEnrolled) return null;

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE}/enroll/${course._id}/progress/${encodeURIComponent(
          video.title
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const progress = await res.json();

      if (res.ok && progress.videoTitle) {
        return progress;
      }
    } catch (error) {
      if (showToast) {
        showToast("Failed to load progress", "error");
      }
    }
    return null;
  }, [video?.title, course?._id, isEnrolled, showToast]);

  const getCurrentChapterProgress = (currentTime) => {
    return chapters
      .filter((chapter) => currentTime >= chapter.startTime)
      .map((chapter) => chapter.id);
  };

  // 🎮 VIDEO CONTROLS
  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoState.isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const seekTo = (seconds) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = Math.max(
      0,
      Math.min(seconds, videoElement.duration)
    );
    saveProgress(true);
  };

  const skipBackward = () => seekTo(videoState.currentTime - 10);
  const skipForward = () => seekTo(videoState.currentTime + 10);

  const changeVolume = (newVolume) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const volume = Math.max(0, Math.min(1, newVolume));
    videoElement.volume = volume;
    setVideoState((prev) => ({ ...prev, volume, isMuted: volume === 0 }));
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMuted = !videoState.isMuted;
    videoElement.muted = newMuted;
    setVideoState((prev) => ({ ...prev, isMuted: newMuted }));
  };

  const changePlaybackRate = (rate) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.playbackRate = rate;
    setVideoState((prev) => ({ ...prev, playbackRate: rate }));
    setUiState((prev) => ({ ...prev, showSpeedMenu: false }));

    if (showToast) {
      showToast(`Speed: ${rate}x`, "info");
    }
  };

  const changeQuality = (quality) => {
    setVideoState((prev) => ({ ...prev, quality }));
    setUiState((prev) => ({ ...prev, showQualityMenu: false }));

    if (showToast) {
      showToast(`Quality: ${quality}`, "info");
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => {
          setVideoState((prev) => ({ ...prev, isFullscreen: true }));
        })
        .catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setVideoState((prev) => ({ ...prev, isFullscreen: false }));
      });
    }
  };

  const jumpToChapter = (chapter) => {
    seekTo(chapter.startTime);
    setUiState((prev) => ({ ...prev, showChapters: false }));

    if (showToast) {
      showToast(`Jumped to: ${chapter.title}`, "info");
    }
  };

  // 🎯 EVENT HANDLERS
  const handleTimeUpdate = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    setVideoState((prev) => ({ ...prev, currentTime, duration }));
  };

  const handleLoadedMetadata = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || hasAutoResumed.current) return;

    const savedProgress = await loadProgress();
    setVideoState((prev) => ({
      ...prev,
      isLoading: false,
      duration: videoElement.duration,
    }));

    if (savedProgress && savedProgress.currentTime > 0) {
      if (
        savedProgress.currentTime > 30 &&
        !savedProgress.completed &&
        savedProgress.currentTime < savedProgress.duration - 30
      ) {
        videoElement.currentTime = savedProgress.currentTime;

        if (savedProgress.volume !== undefined) {
          videoElement.volume = savedProgress.volume;
          setVideoState((prev) => ({ ...prev, volume: savedProgress.volume }));
        }

        if (savedProgress.playbackRate !== undefined) {
          videoElement.playbackRate = savedProgress.playbackRate;
          setVideoState((prev) => ({
            ...prev,
            playbackRate: savedProgress.playbackRate,
          }));
        }

        setVideoProgress(savedProgress);
        hasAutoResumed.current = true;

        if (showToast) {
          const minutes = Math.floor(savedProgress.currentTime / 60);
          const seconds = Math.floor(savedProgress.currentTime % 60);
          showToast(
            `▶️ Resumed from ${minutes}:${seconds.toString().padStart(2, "0")}`,
            "info"
          );
        }
      } else {
        setVideoProgress(savedProgress);
      }
    } else {
      setVideoProgress({
        videoTitle: video.title,
        currentTime: 0,
        duration: videoElement.duration,
        completed: false,
        progressPercentage: 0,
        lastWatched: null,
        watchTime: 0,
        chaptersCompleted: [],
      });
    }
  };

  const handleProgress = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.buffered.length > 0) {
      const buffered = videoElement.buffered.end(
        videoElement.buffered.length - 1
      );
      setVideoState((prev) => ({ ...prev, buffered }));
    }
  };

  const handlePlay = () => {
    setVideoState((prev) => ({ ...prev, isPlaying: true }));
  };

  const handlePause = () => {
    setVideoState((prev) => ({ ...prev, isPlaying: false }));
    saveProgress(true);
  };

  const handleError = (error) => {
    setVideoState((prev) => ({
      ...prev,
      error: error?.message,
      isLoading: false,
    }));

    if (showToast) {
      showToast("❌ Video playback error occurred", "error");
    }
  };

  // 🖱️ CONTROLS UI MANAGEMENT
  const showControlsTemporarily = () => {
    setUiState((prev) => ({ ...prev, showControls: true }));

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (videoState.isPlaying) {
        setUiState((prev) => ({ ...prev, showControls: false }));
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    if (videoState.isPlaying) {
      showControlsTemporarily();
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    if (!progressBar || !videoState.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * videoState.duration;

    seekTo(newTime);
  };

  // 🔄 LIFECYCLE EFFECTS
  useEffect(() => {
    hasAutoResumed.current = false;
    if (video?.title && isEnrolled) {
      loadProgress().then((savedProgress) => {
        if (savedProgress) {
          setVideoProgress(savedProgress);
        }
      });
    }
  }, [video?.title, loadProgress, isEnrolled]);

  useEffect(() => {
    if (videoState.isPlaying && isEnrolled) {
      progressSaveIntervalRef.current = setInterval(() => {
        saveProgress();
      }, Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000);

      return () => {
        clearInterval(progressSaveIntervalRef.current);
        progressSaveIntervalRef.current = null;
      };
    }
  }, [videoState.isPlaying, isEnrolled, saveProgress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveProgress(true);
      }
    };

    const handleBeforeUnload = () => {
      saveProgress(true);
    };

    const handleFullscreenChange = () => {
      setVideoState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (progressSaveIntervalRef.current) {
        clearInterval(progressSaveIntervalRef.current);
        saveProgress(true);
      }
    };
  }, [saveProgress]);

  // 🔒 ENROLLMENT CHECK
  if (!video || !isEnrolled) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
        {course?.thumbnail?.url && (
          <img
            src={course.thumbnail.url}
            alt="Course thumbnail"
            className="absolute w-full h-full object-cover object-top opacity-30"
          />
        )}
        <div className="text-center text-white z-10 p-6">
          <Lock size={48} className="mx-auto mb-4 opacity-60" />
          <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
          <p className="text-gray-300 mb-6 max-w-md">No video to play</p>
        </div>
      </div>
    );
  }

  const currentChapter = chapters.find(
    (chapter) =>
      videoState.currentTime >= chapter.startTime &&
      videoState.currentTime < chapter.endTime
  );

  const currentSubtitle = subtitles.find(
    (subtitle) =>
      videoState.currentTime >= subtitle.start &&
      videoState.currentTime < subtitle.end
  );

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${
        videoState.isFullscreen ? "fixed inset-0 z-50 rounded-none" : "w-full"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (videoState.isPlaying) {
          setUiState((prev) => ({ ...prev, showControls: false }));
        }
      }}
    >
      {/* Main Video Element */}
      <video
        ref={videoRef}
        key={video.url}
        className={`w-full ${
          videoState.isFullscreen ? "h-screen" : "h-64 md:h-96"
        } object-contain`}
        poster={course?.thumbnail?.url}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={(e) => handleError(e.target.error)}
        onContextMenu={(e) => e.preventDefault()}
        playsInline
      >
        <source src={video.url} type="video/mp4" />
        <track kind="captions" src="" srcLang="en" label="English" default />
        Your browser does not support the video tag.
      </video>

      {/* Topsy Completion Popup */}
      <BotPopup
        isOpen={showCompletionPopup}
        onClose={() => setShowCompletionPopup(false)}
        studentName={user?.name || "Student"}
        title="Great Job!"
        description={`Congratulations on completing "${video.title}"! Ready for the next lesson?`}
        buttonText="Continue Learning"
        buttonLink={`/student/courses/${course._id}`}
        botImage="/Bot-image-purchase.png"
      />

      {/* Loading Overlay */}
      {videoState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {videoState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center p-6">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Playback Error</h3>
            <p className="text-gray-300 mb-4">{videoState.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}

      {/* Current Chapter Indicator */}
      {currentChapter && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
          <Clock size={14} />
          {currentChapter.title}
        </div>
      )}

      {/* Progress Indicator */}
      {videoProgress.progressPercentage > 5 && !videoProgress.completed && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
          {Math.round(videoProgress.progressPercentage)}% complete
        </div>
      )}

      {/* Subtitles */}
      {currentSubtitle && uiState.showSubtitles && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded text-center max-w-2xl">
          {currentSubtitle.text}
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          uiState.showControls || !videoState.isPlaying
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          >
            {videoState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="w-full h-2 bg-white bg-opacity-30 rounded-full mb-4 cursor-pointer relative group"
            onClick={handleProgressBarClick}
          >
            {/* Buffered Progress */}
            <div
              className="absolute h-full bg-white bg-opacity-50 rounded-full"
              style={{
                width: `${
                  (videoState.buffered / videoState.duration) * 100 || 0
                }%`,
              }}
            />
            {/* Watched Progress */}
            <div
              className="absolute h-full bg-blue-500 rounded-full"
              style={{
                width: `${
                  (videoState.currentTime / videoState.duration) * 100 || 0
                }%`,
              }}
            />
            {/* Chapters Markers */}
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="absolute top-0 w-1 h-full bg-yellow-400 opacity-70"
                style={{
                  left: `${(chapter.startTime / videoState.duration) * 100}%`,
                }}
                title={chapter.title}
              />
            ))}
            {/* Progress Handle */}
            <div
              className="absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                left: `${
                  (videoState.currentTime / videoState.duration) * 100 || 0
                }%`,
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayPause}
                className="hover:text-blue-400 transition-colors"
              >
                {videoState.isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </button>

              <button
                onClick={skipBackward}
                className="hover:text-blue-400 transition-colors"
                title="Back 10s"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={skipForward}
                className="hover:text-blue-400 transition-colors"
                title="Forward 10s"
              >
                <RotateCw size={20} />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() =>
                    setUiState((prev) => ({ ...prev, showVolumeSlider: true }))
                  }
                  className="hover:text-blue-400 transition-colors"
                >
                  {videoState.isMuted || videoState.volume === 0 ? (
                    <VolumeX size={20} />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </button>

                {uiState.showVolumeSlider && (
                  <div
                    className="absolute bottom-8 left-0 bg-black bg-opacity-80 p-2 rounded"
                    onMouseLeave={() =>
                      setUiState((prev) => ({
                        ...prev,
                        showVolumeSlider: false,
                      }))
                    }
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={videoState.volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Time Display */}
              <div className="text-sm font-mono">
                {formatTime(videoState.currentTime)} /{" "}
                {formatTime(videoState.duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              {/* Chapters Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      showChapters: !prev.showChapters,
                    }))
                  }
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                  title="Chapters"
                >
                  <Clock size={20} />
                  <span className="text-xs">{chapters.length}</span>
                </button>

                {uiState.showChapters && (
                  <div className="absolute bottom-8 right-0 bg-black bg-opacity-90 rounded-lg p-3 min-w-48 max-h-60 overflow-y-auto">
                    <h4 className="text-sm font-semibold mb-2">Chapters</h4>
                    {chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => jumpToChapter(chapter)}
                        className={`block w-full text-left p-2 rounded text-xs hover:bg-white hover:bg-opacity-20 transition-colors ${
                          currentChapter?.id === chapter.id ? "bg-blue-600" : ""
                        }`}
                      >
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-gray-400">
                          {formatTime(chapter.startTime)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtitles Toggle */}
              <button
                onClick={() =>
                  setUiState((prev) => ({
                    ...prev,
                    showSubtitles: !prev.showSubtitles,
                  }))
                }
                className={`hover:text-blue-400 transition-colors ${
                  uiState.showSubtitles ? "text-blue-400" : ""
                }`}
                title="Toggle Subtitles"
              >
                <MessageSquare size={20} />
              </button>

              {/* Settings Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      showSettings: !prev.showSettings,
                    }))
                  }
                  className="hover:text-blue-400 transition-colors"
                  title="Settings"
                >
                  <Settings size={20} />
                </button>

                {uiState.showSettings && (
                  <div className="absolute bottom-8 right-0 bg-black bg-opacity-90 rounded-lg p-3 min-w-48">
                    {/* Playback Speed */}
                    <div className="mb-3">
                      <button
                        onClick={() =>
                          setUiState((prev) => ({
                            ...prev,
                            showSpeedMenu: !prev.showSpeedMenu,
                          }))
                        }
                        className="flex items-center justify-between w-full text-left text-sm hover:text-blue-400"
                      >
                        <span>Speed</span>
                        <span>{videoState.playbackRate}x</span>
                      </button>
                      {uiState.showSpeedMenu && (
                        <div className="mt-2 space-y-1">
                          {playbackSpeeds.map((speed) => (
                            <button
                              key={speed}
                              onClick={() => changePlaybackRate(speed)}
                              className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-white hover:bg-opacity-20 ${
                                videoState.playbackRate === speed
                                  ? "text-blue-400"
                                  : ""
                              }`}
                            >
                              {speed}x {speed === 1 ? "(Normal)" : ""}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quality */}
                    <div className="mb-3">
                      <button
                        onClick={() =>
                          setUiState((prev) => ({
                            ...prev,
                            showQualityMenu: !prev.showQualityMenu,
                          }))
                        }
                        className="flex items-center justify-between w-full text-left text-sm hover:text-blue-400"
                      >
                        <span>Quality</span>
                        <span>{videoState.quality}</span>
                      </button>
                      {uiState.showQualityMenu && (
                        <div className="mt-2 space-y-1">
                          {qualityOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => changeQuality(option.value)}
                              className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-white hover:bg-opacity-20 ${
                                videoState.quality === option.value
                                  ? "text-blue-400"
                                  : ""
                              }`}
                            >
                              <div>{option.label}</div>
                              <div className="text-gray-400">
                                {option.resolution}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Video Stats */}
                    <div className="border-t border-gray-600 pt-2 text-xs text-gray-300">
                      <div>Resolution: {videoState.quality}</div>
                      <div>
                        Buffered:{" "}
                        {Math.round(
                          (videoState.buffered / videoState.duration) * 100 || 0
                        )}
                        %
                      </div>
                      <div>
                        Watch time: {Math.floor(videoProgress.watchTime / 60)}m
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="hover:text-blue-400 transition-colors"
                title="Fullscreen"
              >
                {videoState.isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Panel */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold flex items-center gap-2 mb-1">
              {video.title}
              {videoProgress.completed && (
                <CheckCircle size={16} className="text-green-500" />
              )}
              {videoProgress.progressPercentage > 0 &&
                !videoProgress.completed && (
                  <div className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {Math.round(videoProgress.progressPercentage)}%
                  </div>
                )}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>Lesson {video.order}</span>
              {currentChapter && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {currentChapter.title}
                </span>
              )}
              <span>Quality: {videoState.quality}</span>
              <span>Speed: {videoState.playbackRate}x</span>
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-gray-300 mb-1">
              Progress: {Math.round(videoProgress.progressPercentage || 0)}%
            </div>

            {videoProgress.currentTime > 0 && (
              <div className="text-xs text-gray-400 mb-1">
                {formatTime(videoProgress.currentTime)} /{" "}
                {formatTime(videoProgress.duration || 0)}
              </div>
            )}

            {videoProgress.lastWatched && (
              <div className="text-xs text-gray-500">
                Last watched:{" "}
                {new Date(videoProgress.lastWatched).toLocaleDateString()}
              </div>
            )}

            <div className="text-xs text-gray-500">
              Total watch time:{" "}
              {Math.floor((videoProgress.watchTime || 0) / 60)}m
            </div>
          </div>
        </div>

        {/* Chapter Progress */}
        {chapters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Chapter Progress</div>
            <div className="flex gap-1">
              {chapters.map((chapter) => {
                const isCompleted = videoProgress.chaptersCompleted?.includes(
                  chapter.id
                );
                const isCurrent = currentChapter?.id === chapter.id;

                return (
                  <div
                    key={chapter.id}
                    className={`flex-1 h-2 rounded-sm ${
                      isCompleted
                        ? "bg-green-500"
                        : isCurrent
                        ? "bg-blue-500"
                        : "bg-gray-600"
                    }`}
                    title={`${chapter.title} - ${formatTime(
                      chapter.startTime
                    )}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Copyright Notice */}
      <div className="absolute bottom-2 right-4 text-white text-xs opacity-30 pointer-events-none">
        © Protected Content - {course?.title}
      </div>
    </div>
  );
};

export default AdvancedVideoPlayer;