import React, { useState } from "react";
import { Eye, Calendar, Hash } from "lucide-react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

interface VideoInfoProps {
  videoId: string;
  title: string;
  channel: string;
  views: number;
  uploadDate: string;
  categories?: string[];
  initialFavorite?: boolean;
  onFavoriteToggle?: (videoId: string, isFavorite: boolean) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  videoId,
  title,
  views,
  uploadDate,
  categories = [],
  initialFavorite = false,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // 즐겨찾기 토글
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteToggle?.(videoId, newState);
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-xl shadow-base p-6">
      {/*  제목  */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold text-text-primary leading-snug flex-1">
          {title}
        </h1>
      </div>

      {/* 해시태그 */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-primary border border-blue-200"
            >
              <Hash size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 메타데이터 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-text-muted" />
          <span>{uploadDate}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Eye size={16} className="text-text-muted" />
          <span>{views.toLocaleString()}회</span>
        </div>

        {/* 스크랩 버튼 */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all font-medium text-sm ${
            isFavorite
              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
          title={isFavorite ? "스크랩 해제" : "스크랩 추가"}
        >
          {isFavorite ? (
            <HiHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5" />
          )}
          <span>스크랩</span>
        </button>
      </div>
    </div>
  );
};

export default VideoInfo;