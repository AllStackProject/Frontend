import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Maximize,
  Volume2,
  Volume1,
  VolumeX,
  SkipForward,
  SkipBack,
  Minimize,
} from "lucide-react";
import { useVideoAnalytics } from "@/hooks/video/useVideoAnalytics";
import VideoHeatMap from "@/components/video/VideoHeatMap";
import {
  convertToSegments,
  normalizeHeatMapData,
} from "@/api/video/videoHeatmap";
import type { NormalizedSegment } from "@/types/videoHeatmap";

interface VideoPlayerProps {
  videoUrl: string;
  sessionId: string;
  videoId: number;
  orgId: number;
  wholeTime: number;
  heatmapCounts: number[];
  recentPositionSec: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  sessionId,
  videoId,
  orgId,
  wholeTime,
  heatmapCounts,
  recentPositionSec,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [quality, setQuality] = useState("자동");
  const [playbackRate, setPlaybackRate] = useState(1);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging] = useState(false);

  const [thumbnail, setThumbnail] = useState<string>("");
  const [showControls, setShowControls] = useState(true);
  const [skipFeedback, setSkipFeedback] = useState<{ type: "forward" | "backward" | null; show: boolean }>({ 
    type: null, 
    show: false 
  });
  const [playPauseFeedback, setPlayPauseFeedback] = useState<"play" | "pause" | null>(null);
  const hideControlsTimeout = useRef<number | null>(null);

  const settingsRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Heatmap
  const [heatMapData, setHeatMapData] = useState<NormalizedSegment[]>([]);
  const [showHeatMap, setShowHeatMap] = useState(false);

  // Analytics hook
  const analytics = useVideoAnalytics({
    sessionId,
    videoId,
    orgId,
    wholeTime,
    getVideoEl: () => videoRef.current,
  });

  /* ---------------------------- Skip Functions ---------------------------- */
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 5,
        videoRef.current.duration
      );
      // 피드백 표시
      setSkipFeedback({ type: "forward", show: true });
      setTimeout(() => setSkipFeedback({ type: null, show: false }), 500);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 5,
        0
      );
      // 피드백 표시
      setSkipFeedback({ type: "backward", show: true });
      setTimeout(() => setSkipFeedback({ type: null, show: false }), 500);
    }
  };

  /* ---------------------------- Heatmap Load ----------------------------- */
  useEffect(() => {
    if (heatmapCounts?.length > 0) {
      const segments = convertToSegments([...heatmapCounts].reverse(), 10);
      const normalized = normalizeHeatMapData(segments);
      setHeatMapData(normalized);
    }
  }, [heatmapCounts]);

  /* ---------------------------- Thumbnail ---------------------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleThumb = () => {
      const canvas = document.createElement("canvas");
      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg"));
      }
    };

    v.addEventListener("loadeddata", handleThumb);
    return () => v.removeEventListener("loadeddata", handleThumb);
  }, []);

  /* ---------------------------- HLS Setup ---------------------------- */
  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        xhrSetup: (xhr) => {
          xhr.withCredentials = true;
        },
      });

      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const instance = hlsRef.current;
        if (!instance) return;

        const levels = instance.levels;
        if (levels && levels.length > 0) {
            const highest = levels.length - 1;
            instance.currentLevel = highest;
            setQuality(`${levels[highest].height}p`);
        }

        // recent_position_sec 이어보기 처리
        // 0이면 → 그대로 재생 (이어보기 없음)
        // 0보다 크면 → 이어보기 적용
        if (recentPositionSec > 0) {
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.currentTime = recentPositionSec;
                    console.log("🎬 이어보기 적용:", recentPositionSec);
                }
            }, 300); // HLS duration 안정화용
        } else {
            console.log("🆕 첫 시청 → 0초부터 재생");
        }
    });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("[HLS ERROR]", data);
      });
    } else {
      video.src = videoUrl;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  /* ---------------------------- Video Events ---------------------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => setDuration(v.duration || 0);
    const onTime = () => {
      if (!isDragging && v.duration > 0) {
        setCurrentTime(v.currentTime);
        setProgress((v.currentTime / v.duration) * 100);
      }
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [isDragging]);

  /* ---------------------------- Analytics events ---------------------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setPlayPauseFeedback("pause");
      setTimeout(() => setPlayPauseFeedback(null), 500);
      analytics.onPlay();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setPlayPauseFeedback("play");
      setTimeout(() => setPlayPauseFeedback(null), 500);
      if (!isDragging) analytics.onPause();
    };
    const handleSeeking = () => analytics.onSeeking();
    const handleSeeked = () => analytics.onSeeked();
    const handleEnded = () => {
      setIsPlaying(false);
      analytics.onEnded();
    };

    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("seeking", handleSeeking);
    v.addEventListener("seeked", handleSeeked);
    v.addEventListener("ended", handleEnded);

    return () => {
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("seeking", handleSeeking);
      v.removeEventListener("seeked", handleSeeked);
      v.removeEventListener("ended", handleEnded);
    };
  }, [analytics, isDragging]);

  /* ---------------------------- Autohide Controls ---------------------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const show = () => {
      setShowControls(true);

      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }

      if (isPlaying) {
        hideControlsTimeout.current = window.setTimeout(
          () => setShowControls(false),
          3000
        );
      }
    };

    const leave = () => {
      if (isPlaying) {
        hideControlsTimeout.current = window.setTimeout(
          () => setShowControls(false),
          1000
        );
      }
    };

    container.addEventListener("mousemove", show);
    container.addEventListener("mouseleave", leave);

    return () => {
      container.removeEventListener("mousemove", show);
      container.removeEventListener("mouseleave", leave);
    };
  }, [isPlaying]);

  /* ---------------------------- Keyboard Shortcuts ---------------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 동작하지 않도록
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipBackward();
          break;
        case "ArrowRight":
          e.preventDefault();
          skipForward();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  /* ---------------------------- Fullscreen ---------------------------- */
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  /* ---------------------------- Volume ---------------------------- */
  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (vol > 0 && isMuted) setIsMuted(false);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  /* ---------------------------- Quality Change ---------------------------- */
  const changeQuality = (value: string) => {
    const hls = hlsRef.current;
    if (!hls) return;

    if (value === "auto") {
      hls.currentLevel = -1;
      setQuality("자동");
      setShowSettings(false);
      return;
    }

    const target = Number(value);
    const levelIndex = hls.levels.findIndex((lvl) => lvl.height === target);

    if (levelIndex !== -1) {
      hls.currentLevel = levelIndex;
      setQuality(`${target}p`);
      setShowSettings(false);
    }
  };

  /* ---------------------------- Progress Bar ---------------------------- */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (pct / 100) * (videoRef.current.duration || 0);

    videoRef.current.currentTime = newTime;
    setProgress(pct);
    setCurrentTime(newTime);
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ---------------------------- Settings ---------------------------- */
  const qualityOptions = [
    { label: "자동", value: "auto" },
    { label: "720p", value: "720" },
    { label: "540p", value: "540" },
    { label: "360p", value: "360" },
  ];

  const speedOptions = [
    { label: "2.0x", value: 2 },
    { label: "1.5x", value: 1.5 },
    { label: "1.25x", value: 1.25 },
    { label: "1.0x", value: 1 },
    { label: "0.75x", value: 0.75 },
    { label: "0.5x", value: 0.5 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden shadow-lg group"
      style={{ cursor: showControls ? "default" : "none" }}
    >
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
      {/* ---------------------------- VIDEO ---------------------------- */}
      <video
        ref={videoRef}
        className="w-full aspect-video cursor-pointer bg-black"
        onClick={() =>
          isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
        }
        playsInline
        preload="metadata"
        poster={thumbnail || undefined}
      />

      {/* ---------------------------- Play Button (Center - when stopped) ---------------------------- */}
      {!isPlaying && showControls && !playPauseFeedback && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div 
            className="bg-black/30 backdrop-blur-sm rounded-full p-5 pointer-events-auto cursor-pointer hover:bg-black/50 hover:scale-110 transition-all"
            onClick={() => videoRef.current?.play()}
          >
            <Play size={48} fill="white" className="text-white" />
          </div>
        </div>
      )}

      {/* ---------------------------- Play/Pause Feedback (Center) ---------------------------- */}
      {playPauseFeedback === "play" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-5 animate-fade-in">
            <Play size={48} fill="white" className="text-white" />
          </div>
        </div>
      )}

      {playPauseFeedback === "pause" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-5 animate-fade-in">
            <Pause size={48} className="text-white" />
          </div>
        </div>
      )}

      {/* ---------------------------- Skip Backward Feedback (Left) ---------------------------- */}
      {skipFeedback.show && skipFeedback.type === "backward" && (
        <div className="absolute left-16 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4 animate-fade-in">
            <div className="flex items-center gap-3 text-white">
              <SkipBack size={28} />
              <span className="text-2xl font-bold">5초</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------- Skip Forward Feedback (Right) ---------------------------- */}
      {skipFeedback.show && skipFeedback.type === "forward" && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4 animate-fade-in">
            <div className="flex items-center gap-3 text-white">
              <span className="text-2xl font-bold">5초</span>
              <SkipForward size={28} />
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------- Controls ---------------------------- */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="px-3 pb-1">
          <div
            ref={progressRef}
            className="h-1 bg-white/30 rounded-full cursor-pointer relative hover:h-1.5 transition-all group/progress"
            onClick={handleProgressClick}
            onMouseEnter={() => setShowHeatMap(true)}
            onMouseLeave={() => setShowHeatMap(false)}
          >
            {showHeatMap && heatMapData.length > 0 && duration > 0 && (
              <div className="absolute bottom-3 left-0 w-full h-[40px]">
                <VideoHeatMap
                  segments={heatMapData}
                  duration={duration}
                  height={40}
                  color="#3B82F6"
                  opacity={0.6}
                />
              </div>
            )}

            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full relative shadow-sm"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-3 pb-2 flex items-center gap-2 bg-gradient-to-t from-black to-transparent">
          {/* Left Side */}
          <div className="flex items-center gap-1">
            {/* Play/Pause */}
            <button
              onClick={() =>
                isPlaying ? videoRef.current?.pause() : videoRef.current?.play()
              }
              className="text-white p-2 hover:bg-white/20 rounded transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Skip Back */}
            <button
              onClick={skipBackward}
              className="text-white p-2 hover:bg-white/20 rounded transition-colors"
              title="5초 뒤로"
            >
              <SkipBack size={18} />
            </button>

            {/* Skip Forward */}
            <button
              onClick={skipForward}
              className="text-white p-2 hover:bg-white/20 rounded transition-colors"
              title="5초 앞으로"
            >
              <SkipForward size={18} />
            </button>

            {/* Time */}
            <div className="text-white text-xs font-medium ml-2 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex-1"></div>

          {/* Right Side */}
          <div className="flex items-center gap-1">
            {/* Settings - Quality */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white px-2 py-1.5 hover:bg-white/20 rounded transition-colors text-xs font-medium"
              >
                {quality}
              </button>

              {showSettings && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSettings(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg overflow-hidden min-w-[120px] z-20">
                    <div className="py-1">
                      {qualityOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => changeQuality(opt.value)}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/20 transition-colors ${
                            (quality === opt.label || (quality === "자동" && opt.value === "auto"))
                              ? "text-white font-semibold"
                              : "text-white/80"
                          }`}
                        >
                          {opt.label}
                          {(quality === opt.label || (quality === "자동" && opt.value === "auto")) && (
                            <span className="ml-2">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Speed */}
            <div className="relative" ref={speedRef}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white px-2 py-1.5 hover:bg-white/20 rounded transition-colors text-xs font-medium"
              >
                {playbackRate === 1 ? "보통" : `${playbackRate}x`}
              </button>

              {showSpeedMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSpeedMenu(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg overflow-hidden min-w-[120px] z-20">
                    <div className="py-1">
                      {speedOptions.map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.playbackRate = opt.value;
                              setPlaybackRate(opt.value);
                              setShowSpeedMenu(false);
                            }
                          }}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/20 transition-colors ${
                            playbackRate === opt.value
                              ? "text-white font-semibold"
                              : "text-white/80"
                          }`}
                        >
                          {opt.label}
                          {playbackRate === opt.value && (
                            <span className="ml-2">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Volume */}
            <div 
              className="relative flex items-center group/volume"
              ref={volumeRef}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="text-white p-2 hover:bg-white/20 rounded transition-colors"
              >
                <VolumeIcon />
              </button>

              {/* Volume Slider */}
              <div className={`flex items-center overflow-hidden transition-all duration-200 ${
                showVolumeSlider ? "w-24 ml-1 opacity-100" : "w-0 opacity-0"
              }`}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white p-2 hover:bg-white/20 rounded transition-colors"
            >
              {document.fullscreenElement ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;