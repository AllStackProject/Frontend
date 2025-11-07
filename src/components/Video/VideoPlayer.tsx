import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Settings, Maximize, Volume2, Volume1, VolumeX } from "lucide-react";
import { useVideoAnalytics } from "@/hooks/video/useVideoAnalytics";
import VideoHeatMap from "@/components/video/VideoHeatMap";
import { fetchVideoHeatMap, convertToSegments, normalizeHeatMapData } from "@/api/video/videoHeatmap";
import type { NormalizedSegment } from "@/types/videoHeatmap";

interface VideoPlayerProps {
  videoUrl: string;
  userId?: number;
  videoId?: number;
  orgId?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  userId = 1,
  videoId = 1001,
  orgId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState(true);
  const [quality, setQuality] = useState("자동");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [thumbnail, setThumbnail] = useState<string>("");
  const settingsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<number | null>(null);

  // ---- Heat Map 관련 state
  const [heatMapData, setHeatMapData] = useState<NormalizedSegment[]>([]);
  const [showHeatMap, setShowHeatMap] = useState(false);

  const analytics = useVideoAnalytics({
    userId,
    videoId,
    orgId,
    getVideoEl: () => videoRef.current,
  });

  // ---- Heat Map 데이터 로드
  useEffect(() => {
    const loadHeatMap = async () => {
      try {
        // 서버에서 배열 형식으로 받아옴: [12, 23, 56, 48, ...]
        const viewCounts = await fetchVideoHeatMap(videoId);

        // 배열을 VideoSegment 형식으로 변환 (10초 단위)
        const segments = convertToSegments(viewCounts, 10);

        // 정규화 (0~1 사이 값으로)
        const normalized = normalizeHeatMapData(segments);

        setHeatMapData(normalized);
      } catch (error) {
        console.error("Failed to load heat map data:", error);
      }
    };

    if (videoId) {
      loadHeatMap();
    }
  }, [videoId]);

  // ---- 썸네일 생성
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const generateThumbnail = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg"));
      }
    };

    video.addEventListener("loadeddata", generateThumbnail);
    return () => video.removeEventListener("loadeddata", generateThumbnail);
  }, []);

  // ---- 컨트롤러 자동 숨김/표시
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      // 기존 타이머 제거
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }

      // 재생 중일 때만 자동 숨김 (3초 후)
      if (isPlaying) {
        hideControlsTimeout.current = window.setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseLeave = () => {
      // 재생 중일 때만 즉시 숨김
      if (isPlaying) {
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
        }
        hideControlsTimeout.current = window.setTimeout(() => {
          setShowControls(false);
        }, 1000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isPlaying]);

  // ---- 재생 상태 변경 시 컨트롤러 표시
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    }
  }, [isPlaying]);

  // ---- HLS.js 초기화
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => setQuality("자동"));
      hls.on(Hls.Events.ERROR, (_, data) => console.error("[HLS] Error:", data));
    } else {
      video.src = videoUrl;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  // ---- 비디오 기본 상태
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = isMuted;
  }, [volume, isMuted]);

  // ---- 메타데이터 / 타임 업데이트
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleLoaded = () => setDuration(v.duration || 0);
    const handleTimeUpdate = () => {
      if (!isDragging && v.duration > 0) {
        setCurrentTime(v.currentTime);
        setProgress((v.currentTime / v.duration) * 100);
      }
    };

    v.addEventListener("loadedmetadata", handleLoaded);
    v.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      v.removeEventListener("loadedmetadata", handleLoaded);
      v.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isDragging]);

  // ---- Analytics 이벤트 연결
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handlePlay = () => {
      setIsPlaying(true);
      analytics.onPlay();
    };
    const handlePause = () => {
      setIsPlaying(false);
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

  // ---- 외부 클릭 시 설정 닫기
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

  // ---- 진행바 드래그
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !progressRef.current || !videoRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      const newTime = (pct / 100) * (videoRef.current.duration || 0);
      setProgress(pct);
      setCurrentTime(newTime);
    };
    const handleMouseUp = () => {
      if (isDragging && videoRef.current) {
        videoRef.current.currentTime = currentTime;
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
  }, [isDragging, currentTime]);

  // ---- 재생/정지/전체화면
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    isPlaying ? v.pause() : v.play();
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen();
  };

  // ---- 볼륨 관련
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (pct / 100) * (videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setProgress(pct);
    setCurrentTime(newTime);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ---- 설정 메뉴
  const settingsMenu = [
    { id: "quality", label: "화질", value: quality },
    { id: "speed", label: "재생 속도", value: `${playbackRate}x` },
    { id: "volume", label: "볼륨", value: isMuted ? "음소거" : `${Math.round(volume * 100)}%` },
  ];

  const subMenus: Record<string, { label: string; value: any }[]> = {
    quality: [
      { label: "자동", value: "auto" },
      { label: "720p", value: "720" },
      { label: "480p", value: "480" },
      { label: "360p", value: "360" },
    ],
    speed: [
      { label: "2.0x", value: 2 },
      { label: "1.5x", value: 1.5 },
      { label: "1.25x", value: 1.25 },
      { label: "1.0x (기본)", value: 1 },
      { label: "0.75x", value: 0.75 },
      { label: "0.5x", value: 0.5 },
    ],
    volume: [],
  };

  const handleSubMenuClick = (menuId: string, value: any) => {
    if (menuId === "subtitle") setSubtitle(value);
    if (menuId === "speed" && videoRef.current) {
      videoRef.current.playbackRate = value;
      setPlaybackRate(value);
    }
    if (menuId !== "volume") {
      setShowSubMenu(null);
      setShowSettings(false);
    }
  };
  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-xl overflow-hidden shadow-md group"
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      {/* 비디오 */}
      <video
        ref={videoRef}
        className="w-full aspect-video cursor-pointer bg-black"
        onClick={togglePlay}
        playsInline
        preload="metadata"
        poster={thumbnail || undefined}
      />

      {/* 중앙 재생 버튼 (일시정지 시만 표시) */}
      {!isPlaying && showControls && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-black/50 rounded-full p-6 hover:bg-black/70 transition-all hover:scale-110">
            <Play size={48} strokeWidth={2} fill="white" className="text-white" />
          </div>
        </div>
      )}

      {/* 컨트롤러 */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {/* 재생바 + Heat Map (상단) */}
        <div className="px-4 pb-2">
          <div
            ref={progressRef}
            className="h-[4px] bg-white/30 rounded cursor-pointer relative group/progress"
            onClick={handleProgressClick}
            onMouseEnter={() => setShowHeatMap(true)}
            onMouseLeave={() => setShowHeatMap(false)}
          >
            {/* Heat Map 그래프 (hover 시 표시) */}
            {showHeatMap && heatMapData.length > 0 && duration > 0 && (
              <div className="absolute bottom-5 left-0 w-full h-[40px] -translate-y-ful ">
                <VideoHeatMap
                  segments={heatMapData}
                  duration={duration}
                  height={50}
                  color="#3674B5"
                  opacity={0.7}
                />
              </div>
            )}

            {/* 진행바 */}
            <div
              className="h-full bg-blue-500 rounded relative"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow cursor-grab group-hover/progress:scale-110 transition-transform"
                onMouseDown={() => setIsDragging(true)}
              />
            </div>
          </div>
        </div>

        {/* 컨트롤 버튼들 (하단) */}
        <div className="px-4 pb-4 flex items-center gap-3">
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

          {/* 시간 표시 */}
          <div className="text-white text-xs font-medium min-w-[90px] flex items-center gap-1 select-none">
            <span>{formatTime(currentTime)}</span>
            <span className="text-gray-400">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* 가운데 빈 공간 (flex-1로 차지) */}
          <div className="flex-1"></div>

          {/* 설정 / 전체화면 */}
          <div className="flex items-center gap-2 ml-2">
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

                      {/* 볼륨 서브메뉴 (슬라이더) */}
                      {showSubMenu === "volume" ? (
                        <div className="px-4 py-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={toggleMute}
                              className="text-gray-700 hover:text-blue-600 transition p-1"
                            >
                              <VolumeIcon />
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              className="flex-1 h-2 cursor-pointer accent-blue-500 appearance-none bg-gray-200 rounded-full"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                            <span className="text-sm text-gray-600 font-medium min-w-[40px] text-right">
                              {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* 다른 서브메뉴 (재생속도 등) */
                        subMenus[showSubMenu]?.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => handleSubMenuClick(showSubMenu, item.value)}
                            className={`px-4 py-2 text-sm cursor-pointer flex justify-between hover:bg-gray-100 ${(showSubMenu === "subtitle" && item.value === subtitle) ||
                              (showSubMenu === "speed" && item.value === playbackRate)
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-700"
                              }`}
                          >
                            {item.label}
                          </div>
                        ))
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

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-yellow-400 p-2 rounded transition"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
