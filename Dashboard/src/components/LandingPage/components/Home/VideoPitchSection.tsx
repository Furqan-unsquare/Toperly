import React from "react";
import { Play } from "lucide-react";

const VideoPitchSection = () => {
  return (
    <section className="relative w-full h-[90vh] lg:h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://files.mastersunion.link/assets/gifs/Video_1.mp4" // Replace with your video path
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Text Content */}
      <div className="absolute top-12 left-6 sm:left-12 text-white z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Our Students
        </h2>
        <h3 className="italic text-lg sm:text-xl md:text-2xl mt-1">
          Pitching to Real VCs
        </h3>
      </div>

      {/* Centered Watch Video Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button className="flex items-center gap-3 text-white font-medium text-lg md:text-xl bg-transparent">
          <span className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gradient-to-tr from-yellow-400 to-blue-400 p-1 bg-white/10">
            <Play className="w-5 h-5" />
          </span>
          <span>Watch Video</span>
        </button>
      </div>

      {/* Bottom Right Text */}
      <div className="absolute bottom-4 right-4 text-sm text-white text-right max-w-md z-10 px-4 md:px-0">
        Watch our students <strong>Shubham Khatri</strong> and{" "}
        <strong>Vansh Miglani</strong> pitching their startup{" "}
        <strong>Seeds AI</strong> to the investment committee at{" "}
        <strong>InfoEdge Ventures</strong>
      </div>
    </section>
  );
};

export default VideoPitchSection;
