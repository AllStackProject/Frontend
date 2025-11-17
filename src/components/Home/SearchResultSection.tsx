import React, { useEffect, useState, useMemo } from "react";
import VideoCard from "@/components/home/VideoCard";

interface Video {
  id: string;
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

const DUMMY_SEARCH_RESULTS: Video[] = Array.from({ length: 18 }, (_, i) => {
  const randomThumb = Math.floor(Math.random() * 9) + 1;

  return {
    id: `search-${i + 1}`,
    title: `검색된 영상 ${i + 1} — ${["AI", "클라우드", "보안"][i % 3]} 관련 콘텐츠`,
    uploader: `홍길동_${i + 1}`,
    thumbnail: `/dummy/thum${randomThumb}.png`,
    duration: `${Math.floor(Math.random() * 15) + 1}:${Math.floor(
      Math.random() * 60
    )
      .toString()
      .padStart(2, "0")}`,
    views: Math.floor(Math.random() * 50000),
    uploadDate: `2025-0${(i % 9) + 1}-10`,
    hashtags: ["검색결과", "테스트"],
    isFavorite: i % 2 === 0,
  };
});

const SearchResultSection: React.FC<SearchResultSectionProps> = ({ keyword }) => {
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------
  // 🔍 검색어 기반 결과 불러오기 (API 연동 가능)
  // --------------------------------------
  useEffect(() => {
    setLoading(true);

    // TODO: 검색 API로 교체할 부분
    setTimeout(() => {
      // 키워드 포함된 더미 데이터만 필터링
      const filtered = DUMMY_SEARCH_RESULTS.filter((v) =>
        v.title.includes(keyword)
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 400);
  }, [keyword]);

  // 페이지네이션 설정
  const itemsPerPage = 12;
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <div className="w-full">
      {/* 🔍 상단 검색 헤더 */}
      <div className="mb-10 mt-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
          "<span className="text-primary">{keyword}</span>" 검색 결과
        </h2>
        <p className="text-sm text-text-secondary">
          총 <span className="font-semibold text-text-primary">{searchResults.length}</span>개의 영상
        </p>
      </div>

      {/* 로딩 */}
      {loading ? (
        <div className="w-full py-32 text-center text-text-muted">
          검색 중입니다...
        </div>
      ) : searchResults.length === 0 ? (
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