import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "@/components/home/VideoCard";
import CategorySection from "@/components/home/CategorySection";
import { HiOutlineFire, HiOutlineClock, HiOutlineStar } from "react-icons/hi";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchHomeVideos } from "@/api/home/home";
import LoadingSpinner from "../common/LoadingSpinner";

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

interface VideoListSectionProps {
  selectedTag: string;
  onFavoriteToggle?: (videoId: string, isFavorite: boolean) => void;
}

type SortType = "latest" | "popular" | "recommended";

const VideoListSection: React.FC<VideoListSectionProps> = ({ selectedTag }) => {
  const [searchParams] = useSearchParams();
  const { orgId } = useAuth();

  const [sortType, setSortType] = useState<SortType>("recommended");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const urlCategory = searchParams.get("category"); // 'new', 'hot', 'recommended'

  /* ============================================================
      1) API 호출 (정렬 타입 변경 시 서버 요청)
  ============================================================ */
  useEffect(() => {
    if (!orgId) return;

    const load = async () => {
      setLoading(true);
      try {
        const filter =
          sortType === "recommended"
            ? "recommend"
            : sortType === "latest"
            ? "recent"
            : "popular";

        const result = await fetchHomeVideos(orgId, filter);

        const mapped = result.videos.map((v: any) => ({
          id: Number(v.id),
          title: v.title,
          uploader: v.creator,
          thumbnail: v.thumbnail_url,
          duration: `${Math.floor(v.whole_time / 60)}:${String(
            v.whole_time % 60
          ).padStart(2, "0")}`,
          views: v.watch_cnt,
          uploadDate: v.created_at,
          hashtags: v.categories || [],
          isFavorite: v.is_scrapped,
        }));

        setVideos(mapped);
        setCurrentPage(1);
      } catch (err) {
        console.error("❌ 홈 영상 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId, sortType]);

  /* ============================================================
      2) 최종 필터링 (카테고리 + 태그 + URL category)
  ============================================================ */
  const finalVideos = useMemo(() => {
    let result = [...videos];

    // 1) 멤버 지정 그룹 카테고리 필터
    if (selectedCategory !== "전체") {
      result = result.filter((v) => v.hashtags?.includes(selectedCategory));
    }

    // 2) 상단 태그 필터 (selectedTag)
    if (selectedTag !== "전체") {
      result = result.filter((v) => v.hashtags?.includes(selectedTag));
    }

    // 3) URL category 파라미터
    if (urlCategory === "recommended") {
      result = result.filter((v) => v.isFavorite);
    } else if (urlCategory === "hot") {
      result = result.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else if (urlCategory === "new") {
      result = result.sort((a, b) =>
        a.uploadDate! < b.uploadDate! ? 1 : -1
      );
    }

    return result;
  }, [videos, selectedCategory, selectedTag, urlCategory]);

  /* ============================================================
      3) 페이지네이션
  ============================================================ */
  const totalPages = Math.ceil(finalVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVideos = finalVideos.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  /* ============================================================
      4) 정렬 변경
  ============================================================ */
  const handleSortChange = (type: SortType) => {
    setSortType(type);
    setIsDropdownOpen(false);
  };

  const sortOptions = {
    recommended: { label: "추천순", icon: <HiOutlineStar className="text-lg" /> },
    popular: { label: "인기순", icon: <HiOutlineFire className="text-lg" /> },
    latest: { label: "최신순", icon: <HiOutlineClock className="text-lg" /> },
  };

  /* ============================================================
      UI 렌더링
  ============================================================ */
  if (loading) {
  return <LoadingSpinner text="로딩 중..." />;
}

  return (
    <div className="w-full">
      {/* 상단 필터 헤더 */}
      <div className="rounded-xl mb-6 mt-3">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          {/* 왼쪽: 카테고리 + 결과 개수 */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:flex-1">
            <div className="w-full md:w-auto">
              <CategorySection onCategoryChange={setSelectedCategory} />
            </div>

            <div className="flex md:justify-start justify-center">
              <span className="inline-flex px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100">
                {finalVideos.length}개
              </span>
            </div>
          </div>

          {/* 오른쪽: 정렬 드롭다운 */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start px-4 md:px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-blue-600">
                {sortOptions[sortType].icon}
              </span>
              <span className="font-medium text-gray-700">
                {sortOptions[sortType].label}
              </span>
              <ChevronDown
                size={18}
                className={`ml-auto text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <>
                {/* 바깥 클릭 닫기 */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-full md:w-[200px] bg-white border-2 border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                  {Object.entries(sortOptions).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => handleSortChange(key as SortType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                        sortType === key
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          sortType === key
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {sortType === key && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <span
                        className={
                          sortType === key ? "text-blue-600" : "text-gray-500"
                        }
                      >
                        {option.icon}
                      </span>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 비디오 그리드 */}
      {finalVideos.length === 0 ? (
        <div className="text-center py-24 sm:py-32 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">
            해당 조건의 영상이 없습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {currentVideos.map((video) => (
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

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4 sm:mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>

              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 text-gray-400 font-medium text-xs sm:text-sm">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentPage(page as number)}
                        className={`min-w-[34px] sm:min-w-[40px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md scale-105"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoListSection;