import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiClock } from "react-icons/hi";
import { getWatchedVideos } from "@/api/myactivity/getWatchedVideos";
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap";
import { Heart, HeartOff, PlayCircle, Loader2 } from "lucide-react";
import type { WatchedVideo } from "@/types/video";

const LearningSection: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<WatchedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const orgId = Number(localStorage.getItem("org_id"));
  const orgName = localStorage.getItem("org_name") || "조직";

  /** 시청 기록 + 스크랩 목록 병합 로드 */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!orgId) {
          setError("조직 정보가 없습니다.");
          setLoading(false);
          return;
        }
        setLoading(true);

        const data = await getWatchedVideos(orgId);
        setVideos(data);
      } catch (err: any) {
        console.error("🚨 시청 기록 로드 실패:", err);
        setError(err.message || "시청 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [orgId]);

  /** 스크랩 토글 */
  const toggleScrap = async (
    e: React.MouseEvent,
    id: number,
    currentState?: boolean
  ) => {
    e.stopPropagation();
    if (loadingId === id) return;
    setLoadingId(id);

    try {
      if (currentState) {
        // 스크랩 해제
        const res = await deleteVideoScrap(orgId, id);
        if (res.is_success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, is_scrapped: false } : v))
          );
        }
      } else {
        // 스크랩 등록
        const res = await postVideoScrap(orgId, id);
        if (res.is_success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, is_scrapped: true } : v))
          );
        }
      }
    } catch (error: any) {
      if (error.message?.includes("이미 스크랩")) {
        setVideos((prev) =>
          prev.map((v) => (v.id === id ? { ...v, is_scrapped: true } : v))
        );
      } else {
        alert(error.message || "스크랩 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  /** 상세 이동 */
  const handleVideoClick = (id: number) => {
    navigate(`/video/${id}`);
  };

  // 초를 "분:초" 형태로 변환하는 유틸 함수
  const formatDuration = (seconds?: number): string => {
    if (!seconds && seconds !== 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="animate-spin mr-2" size={20} />
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 text-sm">{error}</div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border-light">
        <PlayCircle className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-text-muted text-sm">
          {orgName}에서 시청한 영상이 없습니다.
        </p>
        <p className="text-text-muted text-xs mt-2">
          영상을 시청해보세요!
        </p>
      </div>
    );
  }

  const videosToShow = isExpanded ? videos : videos.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">최근 시청 기록</h2>
          <span className="text-sm text-text-muted">({videos.length}개)</span>
        </div>

        {/* 더보기 / 접기 버튼 */}
        {videos.length > 3 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>

      {/* 영상 카드 */}
      <div className="grid gap-5 md:grid-cols-3">
        {videosToShow.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video.id)}
            className="relative cursor-pointer p-4 bg-white border border-border-light rounded-lg shadow-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            {/* 썸네일 */}
            <div className="relative w-full h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
              <img
                src={video.img || "/dummy/video-thumb.png"}
                alt={video.name}
                className="w-full h-full object-cover"
              />
              {/* 재생 시간 */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <HiClock className="text-sm" />
                {formatDuration(video.whole_time)}
              </div>
              {/* 스크랩 버튼 */}
              <button
                onClick={(e) => toggleScrap(e, video.id, video.is_scrapped)}
                disabled={loadingId === video.id}
                className={`absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10 ${
                  loadingId === video.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {video.is_scrapped ? (
                  <Heart
                    className="text-[#E25A5A] fill-[#E25A5A] transition-transform duration-200 hover:scale-110"
                    size={20}
                  />
                ) : (
                  <HeartOff
                    className="text-gray-400 transition-transform duration-200 hover:scale-110"
                    size={20}
                  />
                )}
              </button>
            </div>

            {/* 제목 */}
            <h4 className="text-base font-medium text-text-primary truncate">
              {video.name}
            </h4>

            {/* 최근 시청일 */}
            <p className="text-xs text-text-muted mt-1">
              최근 시청일:{" "}
              {new Date(video.recent_watch).toLocaleDateString("ko-KR")}
            </p>

            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(video.watch_rate || 0).toFixed(0)}%` }}
              ></div>
            </div>

            {/* 퍼센트 */}
            <p className="text-xs text-text-secondary mt-1">
              시청률 {(video.watch_rate || 0).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningSection;