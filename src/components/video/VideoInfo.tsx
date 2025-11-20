import React, { useState, useEffect } from "react";
import { Eye, Calendar, Clock } from "lucide-react";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap";

interface VideoInfoProps {
  orgId: number;
  videoId: number;
  title: string;
  views: number;
  description?: string;         
  uploadDate?: string;
  duration?: string;
  categories?: string[];
  initialFavorite?: boolean;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  orgId,
  videoId,
  title,
  views,
  uploadDate = "",
  description = "",    
  duration,
  categories = [],     
  initialFavorite = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 서버 데이터 변경 시 하트 상태 갱신 */
  useEffect(() => {
    if (initialFavorite !== undefined && initialFavorite !== null) {
      setIsFavorite(initialFavorite);
    }
  }, [initialFavorite]);

  /** 스크랩 등록/해제 */
  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        const res = await deleteVideoScrap(orgId, videoId);
        if (res?.is_success) setIsFavorite(false);
      } else {
        const res = await postVideoScrap(orgId, videoId);
        if (res?.is_success) setIsFavorite(true);
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

  /** 설명 더보기/접기 */
  const toggleDescription = () => setIsExpanded(!isExpanded);

  /** 긴 설명 처리 - 안전하게 length 체크 */
  const shouldTruncate = (description?.length ?? 0) > 100;

  const displayDescription =
    isExpanded || !shouldTruncate
      ? description
      : description.slice(0, 150) + "...";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

      {/* 헤더 영역 */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
          {title}
        </h1>

        {/* 카테고리 태그 */}
        {(categories?.length ?? 0) > 0 && (
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

          {/* 조회수 */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">조회수</p>
              <p className="font-semibold text-gray-900">
                {views?.toLocaleString?.() ?? 0}회
              </p>
            </div>
          </div>

          {/* 업로드일 */}
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Calendar size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">업로드</p>
              <p className="font-semibold text-gray-900">
                {uploadDate || "-"}
              </p>
            </div>
          </div>

          {/* 재생시간 */}
          {duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">재생시간</p>
                <p className="font-semibold text-gray-900">
                  {duration}
                </p>
              </div>
            </div>
          )}

          {/* 스크랩 버튼 */}
          <div className="ml-auto">
            <button
              onClick={handleFavoriteClick}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayDescription}
        </p>

        {shouldTruncate && (
          <button
            onClick={toggleDescription}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;