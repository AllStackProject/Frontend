import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Settings, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState(true);
  const [quality, setQuality] = useState("1080p");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1357);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 비디오 시간 업데이트
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const updateDuration = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [isDragging]);

  // 외부 클릭 시 설정 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
        setShowSubMenu(null);
      }
    };
    if (showSettings) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  // 드래그 진행바 제어
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      const newTime = (pct / 100) * duration;
      setProgress(pct);
      setCurrentTime(newTime);
    };
    const handleMouseUp = () => {
      if (isDragging) {
        if (videoRef.current?.duration) {
          videoRef.current.currentTime = currentTime;
        }
        setIsDragging(false);
      }
    };
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, currentTime, duration]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else videoRef.current.requestFullscreen();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (pct / 100) * duration;
    if (videoRef.current?.duration) videoRef.current.currentTime = newTime;
    setProgress(pct);
    setCurrentTime(newTime);
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const settingsMenu = [
    { id: "subtitle", label: "자막", value: subtitle ? "ON" : "OFF" },
    { id: "quality", label: "품질", value: quality },
    { id: "speed", label: "재생 속도", value: `${playbackRate}x` },
  ];

  const subMenus = {
    subtitle: [
      { label: "ON", value: true },
      { label: "OFF", value: false },
    ],
    quality: [
      { label: "1080p", value: "1080p" },
      { label: "720p", value: "720p" },
      { label: "480p", value: "480p" },
      { label: "360p", value: "360p" },
    ],
    speed: [
      { label: "2.0x", value: 2 },
      { label: "1.5x", value: 1.5 },
      { label: "1.25x", value: 1.25 },
      { label: "1.0x (기본)", value: 1 },
      { label: "0.75x", value: 0.75 },
      { label: "0.5x", value: 0.5 },
    ],
  };

  const handleSubMenuClick = (menuId: string, value: any) => {
    if (menuId === "subtitle") setSubtitle(value);
    if (menuId === "quality") setQuality(value);
    if (menuId === "speed" && videoRef.current) {
      videoRef.current.playbackRate = value;
      setPlaybackRate(value);
    }
    setShowSubMenu(null);
    setShowSettings(false);
  };

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-md">
      {/* 비디오 */}
      <video
        ref={videoRef}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* 컨트롤 */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-3">
        {/* ▶ 재생 버튼 */}
        <button
          onClick={togglePlay}
          className="text-white hover:text-yellow-400 p-2 rounded transition"
        >
          {isPlaying ? (
            <Pause size={20} strokeWidth={2.5} />
          ) : (
            <Play size={20} strokeWidth={2.5} fill="white" />
          )}
        </button>

        {/* 시간 */}
        <div className="text-white text-xs font-medium min-w-[80px] flex items-center gap-1 select-none">
          <span>{formatTime(currentTime)}</span>
          <span className="text-gray-400">/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 진행바 */}
        <div className="flex-1 h-[6px] bg-white/30 rounded cursor-pointer relative group"
          ref={progressRef}
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-blue-500 rounded relative"
            style={{ width: `${progress}%` }}
          >
            <div
              className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow cursor-grab group-hover:scale-110 transition-transform"
              onMouseDown={() => setIsDragging(true)}
            ></div>
          </div>
        </div>

        {/* 오른쪽 버튼 */}
        <div className="flex items-center gap-2 ml-2">
          {/* 설정 */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowSubMenu(null);
              }}
              className="text-white hover:text-yellow-400 p-2 rounded transition"
            >
              <Settings size={20} />
            </button>

            {/* 설정 메뉴 */}
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-3 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] max-h-[260px] overflow-y-auto z-10">
                {showSubMenu ? (
                  <>
                    <div
                      className="flex items-center gap-2 p-3 border-b text-blue-600 font-semibold cursor-pointer hover:bg-gray-50"
                      onClick={() => setShowSubMenu(null)}
                    >
                      ← {settingsMenu.find((m) => m.id === showSubMenu)?.label}
                    </div>
                    {subMenus[showSubMenu as keyof typeof subMenus]?.map(
                      (item, i) => (
                        <div
                          key={i}
                          onClick={() => handleSubMenuClick(showSubMenu, item.value)}
                          className={`px-4 py-2 text-sm cursor-pointer flex justify-between hover:bg-gray-100 ${
                            (showSubMenu === "subtitle" &&
                              item.value === subtitle) ||
                            (showSubMenu === "quality" &&
                              item.value === quality) ||
                            (showSubMenu === "speed" &&
                              item.value === playbackRate)
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </div>
                      )
                    )}
                  </>
                ) : (
                  settingsMenu.map((option) => (
                    <div
                      key={option.id}
                      className="flex justify-between items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                      onClick={() => setShowSubMenu(option.id)}
                    >
                      <span>{option.label}</span>
                      <span className="text-gray-500 text-xs">
                        {option.value} ›
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 전체 화면 */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-yellow-400 p-2 rounded transition"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;