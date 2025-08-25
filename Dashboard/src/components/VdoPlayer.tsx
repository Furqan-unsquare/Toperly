import React, { useEffect, useState } from "react";
import axios from "axios";

interface VdoPlayerProps {
  videoId: string; // VdoCipher videoId
}

const VdoPlayer: React.FC<VdoPlayerProps> = ({ videoId }) => {
  const [otp, setOtp] = useState("");
  const [playbackInfo, setPlaybackInfo] = useState("");
  const [error, setError] = useState("");
  
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOtp = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/vdocipher/otp/${videoId}`
        );
        setOtp(response.data.otp);
        setPlaybackInfo(response.data.playbackInfo);
      } catch (err: any) {
        console.error("Failed to fetch OTP:", err);
        setError("Could not load the video");
      }
    };

    fetchOtp();
  }, [videoId]);

  if (error) return <div>{error}</div>;
  if (!otp || !playbackInfo) return <div>Loading video...</div>;

  const iframeSrc = `https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`;

  return (
    <iframe
      src={iframeSrc}
      style={{ border: 0, width: "100%", height: 405, maxWidth: 720 }}
      allow="encrypted-media"
      allowFullScreen
      title="VdoCipher Player"
    ></iframe>
  );
};

export default VdoPlayer;
