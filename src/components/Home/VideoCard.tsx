import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiClock,
  HiEye,
  HiCalendar,
  HiHeart,
  HiOutlineHeart,
} from "react-icons/hi";
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap";

interface VideoCardProps {
  thumbnail: string;
  title: string;
  duration?: string;
  views?: number;
  uploadDate?: string;
  videoId: number;
  orgId: number;
  isFavorite?: boolean;
  onFavoriteToggle?: (videoId: number, isFavorite: boolean) => void;
}

const VideoCard = ({
  thumbnail,
  title,
  duration = "0:00",
  views = 0,
  uploadDate,
  videoId,
  orgId,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
}: VideoCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /** ✅ props 변경 시 자동 반영 */
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  /** ✅ 서버 연동 */
  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        // 🔹 스크랩 해제
        const res = await deleteVideoScrap(orgId, videoId);
        if (res.is_success) {
          setIsFavorite(false);
          onFavoriteToggle?.(videoId, false);
        }
      } else {
        // 🔹 스크랩 등록
        const res = await postVideoScrap(orgId, videoId);
        if (res.is_success) {
          setIsFavorite(true);
          onFavoriteToggle?.(videoId, true);
        }
      }
    } catch (error: any) {
      if (error.message?.includes("이미 스크랩")) {
        setIsFavorite(true);
      } else {
        alert(error.message || "스크랩 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 조회수 포맷팅
  const formatViews = (count: number): string => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  // 날짜 포맷팅
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "방금 전";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 0) return "오늘";
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  // 동영상 클릭
  const handleCardClick = () => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className="w-full cursor-pointer group focus:outline-none"
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* 재생 시간 */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
          <HiClock className="text-sm" />
          {duration}
        </div>

        {/* 즐겨찾기 버튼 */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={loading}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-200 backdrop-blur-sm ${
            loading
              ? "bg-black/30 cursor-not-allowed"
              : "bg-black/50 hover:bg-black/70"
          }`}
        >
          {isFavorite ? (
            <HiHeart className="w-5 h-5 text-red-500 transition-transform duration-200 scale-110" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-white hover:scale-110 transition-transform duration-200" />
          )}
        </button>

        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-3 space-y-2">
        <h3
          className="
            text-base font-semibold text-text-primary leading-snug 
            group-hover:text-primary transition-colors
            line-clamp-2 h-[48px]
          "
        >
          {title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <HiEye className="text-sm" />
            <span>{formatViews(views)}회</span>
          </div>
          <span className="text-text-secondary">•</span>
          <div className="flex items-center gap-1">
            <HiCalendar className="text-sm" />
            <span>{formatDate(uploadDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;