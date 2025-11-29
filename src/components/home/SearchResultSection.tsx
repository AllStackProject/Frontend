import React, { useEffect, useState } from "react";
import VideoCard from "@/components/home/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { fetchSearchVideos } from "@/api/home/home";

interface Video {
  id: number;
  title: string;
  uploader: string;
  thumbnail: string;
  duration?: string;
  views?: number;
  uploadDate?: string;
  hashtags?: string[];
  isFavorite?: boolean;
}

interface SearchResultSectionProps {
  keyword: string;
}

const SearchResultSection: React.FC<SearchResultSectionProps> = ({ keyword }) => {
  const { orgId } = useAuth();
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  

  /* ============================================
      검색 API 호출
  ============================================ */
  useEffect(() => {
    const load = async () => {
      if (!orgId) return;

      try {
        const videos = await fetchSearchVideos(orgId, keyword);

        const mapped: Video[] = videos.map((v: any) => ({
          id: v.id,
          title: v.title,
          uploader: v.creator,
          thumbnail: v.thumbnail_url,
          duration: `${Math.floor(v.whole_time / 60)}:${String(v.whole_time % 60).padStart(2, "0")}`,
          views: v.watch_cnt,
          uploadDate: v.created_at,
          hashtags: v.categories || [],
          isFavorite: v.is_scrapped,
        }));

        setSearchResults(mapped);
      } catch (err) {
        console.error("❌ 검색 실패:", err);
        setSearchResults([]);
      } finally {
        
      }
    };

    load();
  }, [keyword, orgId]);

  /* ============================================
      페이지네이션 설정 (원하면 확장)
  ============================================ */
  const itemsPerPage = 12;

  return (
    <div className="w-full">
      {/* 검색 헤더 */}
      <div className="mb-10 mt-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
          "<span className="text-primary">{keyword}</span>" 검색 결과
        </h2>
        <p className="text-sm text-text-secondary">
          총{" "}
          <span className="font-semibold text-text-primary">
            {searchResults.length}
          </span>{" "}
          개의 영상
        </p>
      </div>

      {/* 로딩 */}
      {searchResults.length === 0 ? (
        <div className="w-full py-32 text-center">
          <p className="text-lg font-medium text-text-muted">
            검색 결과가 없습니다
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 검색어로 다시 검색해보세요
          </p>
        </div>
      ) : (
        <>
          {/* 비디오 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {searchResults.slice(0, itemsPerPage).map((video) => (
              <VideoCard
                key={video.id}
                thumbnail={video.thumbnail}
                uploader={video.uploader}
                title={video.title}
                duration={video.duration}
                views={video.views}
                uploadDate={video.uploadDate}
                videoId={video.id}
                orgId={orgId!}
                isFavorite={video.isFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResultSection;