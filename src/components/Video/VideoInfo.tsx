import React, { useState } from "react";
import { Eye, Calendar, Clock } from "lucide-react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";

interface VideoInfoProps {
  videoId: string;
  title: string;
  channel: string;
  views: number;
  description: string;
  uploadDate: string;
  duration?: string; // 동영상 길이 (예: "15:30")
  categories?: string[];
  initialFavorite?: boolean;
  onFavoriteToggle?: (videoId: string, isFavorite: boolean) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  videoId,
  title,
  channel,
  views,
  uploadDate,
  description,
  duration,
  categories = [],
  initialFavorite = false,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isExpanded, setIsExpanded] = useState(false);

  // 즐겨찾기 토글
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteToggle?.(videoId, newState);
  };

  // 설명 더보기/접기
  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // 긴 설명 처리
  const shouldTruncate = description.length > 100;
  const displayDescription = isExpanded || !shouldTruncate 
    ? description 
    : description.slice(0, 150) + "...";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 영역 */}
      <div className="p-6 border-b border-gray-100">
        {/* 제목 */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{channel}</p>
        </div>

        {/* 카테고리 태그 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-bg-card text-primary-light border border-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 메타데이터 영역 */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">조회수</p>
              <p className="font-semibold text-gray-900">
                {views.toLocaleString()}회
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
              <Calendar size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">업로드</p>
              <p className="font-semibold text-gray-900">{uploadDate}</p>
            </div>
          </div>

          {duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
                <Clock size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">재생시간</p>
                <p className="font-semibold text-gray-900">{duration}</p>
              </div>
            </div>
          )}

          {/* 스크랩 버튼 */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-semibold text-sm ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              title={isFavorite ? "스크랩 해제" : "스크랩 추가"}
            >
              {isFavorite ? (
                <HiHeart className="w-5 h-5 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 설명 영역 */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayDescription}
          </p>
        </div>

        {shouldTruncate && (
          <button
            onClick={toggleDescription}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;