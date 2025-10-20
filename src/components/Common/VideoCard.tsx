// src/components/Common/VideoCard.tsx
import { useState } from 'react';
import { HiClock, HiEye, HiCalendar, HiHeart, HiOutlineHeart } from 'react-icons/hi';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  author: string;
  duration?: string;      // 재생 시간 (예: "12:34")
  views?: number;         // 조회수
  uploadDate?: string;    // 업로드 날짜 (예: "2024-03-15")
  videoId?: string;       // 영상 ID (즐겨찾기용)
  isFavorite?: boolean;   // 초기 즐겨찾기 상태
  onFavoriteToggle?: (videoId: string, isFavorite: boolean) => void;
}

const VideoCard = ({ 
  thumbnail, 
  title, 
  author, 
  duration = "0:00",
  views = 0,
  uploadDate,
  videoId = '',
  isFavorite: initialFavorite = false,
  onFavoriteToggle
}: VideoCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // 조회수 포맷팅 (1000 -> 1K, 1000000 -> 1M)
  const formatViews = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // 날짜 포맷팅 (상대 시간)
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '방금 전';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
    return `${Math.floor(diffDays / 365)}년 전`;
  };

  // 즐겨찾기 토글
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // 부모 컴포넌트에 알림 (백엔드 API 호출용)
    if (onFavoriteToggle) {
      onFavoriteToggle(videoId, newFavoriteState);
    }
    
    // TODO: 백엔드 API 연동
    console.log(`영상 ${videoId} 즐겨찾기: ${newFavoriteState}`);
  };

  return (
    <div className="min-w-[360px] max-w-[380px] cursor-pointer group">
      {/* 썸네일 영역 */}
      <div className="relative w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 재생 시간 오버레이 */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <HiClock className="text-sm" />
          {duration}
        </div>

        {/* 즐겨찾기 버튼 */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 backdrop-blur-sm group/favorite"
          aria-label={isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}
        >
          {isFavorite ? (
            <HiHeart className="w-5 h-5 text-error animate-scale-in" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-white group-hover/favorite:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-3 space-y-1">
        {/* 제목 */}
        <p className="text-base font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </p>
        
        {/* 작성자 */}
        <p className="text-sm text-text-secondary">
          {author}
        </p>
        
        {/* 조회수 & 날짜 */}
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <HiEye className="text-sm" />
            <span>조회수 {formatViews(views)}</span>
          </div>
          
          <span>•</span>
          
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