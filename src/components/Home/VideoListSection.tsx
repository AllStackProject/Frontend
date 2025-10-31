import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "@/components/Home/VideoCard";
import HashtagSelect from "@/components/Home/HashtagSelect";
import { HiOutlineFire, HiOutlineClock, HiOutlineStar, HiChevronDown } from "react-icons/hi";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Video {
    id: string;
    title: string;
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

const DUMMY_VIDEOS: Video[] = Array.from({ length: 50 }, (_, i) => {
    const randomThumb = Math.floor(Math.random() * 9) + 1;

    return {
        id: `${i + 1}`,
        title: `예시 동영상 ${i + 1} — 동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산`,
        thumbnail: `/dummy/thum${randomThumb}.png`,
        duration: `${Math.floor(Math.random() * 15) + 3}:${Math.floor(
            Math.random() * 60
        )
            .toString()
            .padStart(2, "0")}`,
        views: Math.floor(Math.random() * 50000),
        uploadDate: `2025-0${(i % 9) + 1}-10`,
        hashtags: i % 3 === 0 ? ["AI", "보안"] : ["교육", "테크"],
        isFavorite: i % 2 === 0,
    };
});

const VideoListSection: React.FC<VideoListSectionProps> = ({
    selectedTag,
    onFavoriteToggle,
}) => {
    const [searchParams] = useSearchParams();
    const [sortType, setSortType] = useState<SortType>("recommended");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // URL에서 카테고리 파라미터 가져오기
    const category = searchParams.get("category");

    // 태그별 필터링
    const filteredByTag = useMemo(() => {
        if (selectedTag === "전체") return DUMMY_VIDEOS;
        return DUMMY_VIDEOS.filter((v) => v.hashtags?.includes(selectedTag));
    }, [selectedTag]);

    // 정렬 적용
    const sortedVideos = useMemo(() => {
        let videos = [...filteredByTag];

        switch (sortType) {
            case "latest":
                return videos.sort((a, b) => (a.uploadDate! < b.uploadDate! ? 1 : -1));
            case "popular":
                return videos.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
            case "recommended":
                return videos.filter((v) => v.isFavorite).sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
            default:
                return videos;
        }
    }, [filteredByTag, sortType]);

    // 카테고리별 필터링 (URL 파라미터 기반)
    const filteredVideos = useMemo(() => {
        if (!category) return sortedVideos;

        switch (category) {
            case "new":
                return sortedVideos.sort((a, b) => (a.uploadDate! < b.uploadDate! ? 1 : -1));
            case "hot":
                return sortedVideos.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
            case "recommended":
                return sortedVideos.filter((v) => v.isFavorite);
            default:
                return sortedVideos;
        }
    }, [sortedVideos, category]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVideos = filteredVideos.slice(startIndex, endIndex);

    // 페이지 번호 배열 생성
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // 필터 변경 핸들러
    const handleSortChange = (type: SortType) => {
        setSortType(type);
        setIsDropdownOpen(false);
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로
        // TODO: 서버 API 호출
        console.log(`정렬 타입 변경: ${type}`);
    };

    // 정렬 타입별 라벨과 아이콘
    const sortOptions = {
        latest: { label: "최신순", icon: <HiOutlineClock className="text-lg" /> },
        popular: { label: "인기순", icon: <HiOutlineFire className="text-lg" /> },
        recommended: { label: "추천순", icon: <HiOutlineStar className="text-lg" /> },
    };

    return (
        <div className="w-full">
            {/* 헤더 + 해시태그 + 필터 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10 mt-10">
                {/* 해시태그 + 영상 개수 */}
                <div className="flex items-center gap-3 sm:mb-0 mb-2">
                    <HashtagSelect />
                    <span className="text-sm text-text-muted font-medium px-3 py-1 bg-gray-100 rounded-full flex items-center justify-center">
                        {filteredVideos.length}개
                    </span>
                </div>

                {/* 정렬 드롭다운 */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-light rounded-lg hover:bg-gray-50 transition-colors min-w-[140px]"
                    >
                        {sortOptions[sortType].icon}
                        <span className="font-medium text-text-primary">
                            {sortOptions[sortType].label}
                        </span>
                        <HiChevronDown
                            className={`text-text-secondary transition-transform ml-auto ${isDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>


                    {/* 드롭다운 메뉴 */}
                    {isDropdownOpen && (
                        <>
                            {/* 오버레이 */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            />

                            {/* 메뉴 */}
                            <div className="absolute right-0 mt-2 w-[180px] bg-white border border-border-light rounded-xl shadow-lg z-20 py-2">
                                {/* 추천순 */}
                                <button
                                    onClick={() => handleSortChange("recommended")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${sortType === "recommended" ? "bg-gradient-to-br" : ""
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortType === "recommended"
                                                ? "border-primary"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {sortType === "recommended" && (
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <HiOutlineStar className="text-lg text-text-primary" />
                                    <span className="font-medium text-text-primary">
                                        추천순
                                    </span>
                                </button>

                                {/* 인기순 */}
                                <button
                                    onClick={() => handleSortChange("popular")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${sortType === "popular" ? "bg-gradient-to-br" : ""
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortType === "popular"
                                                ? "border-primary"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {sortType === "popular" && (
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <HiOutlineFire className="text-lg text-text-primary" />
                                    <span className="font-medium text-text-primary">
                                        인기순
                                    </span>
                                </button>

                                {/* 최신순 */}
                                <button
                                    onClick={() => handleSortChange("latest")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${sortType === "latest" ? "bg-bg-gradient-to-br" : ""
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${sortType === "latest"
                                                ? "border-primary"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {sortType === "latest" && (
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                        )}
                                    </div>
                                    <HiOutlineClock className="text-lg text-text-primary" />
                                    <span className="font-medium text-text-primary">
                                        최신순
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 비디오 그리드 */}
            {filteredVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-text-muted py-32">
                    <p className="text-lg font-medium">
                        {sortType === "recommended"
                            ? "추천 영상이 없습니다"
                            : "해당 태그의 영상이 없습니다"}
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                        {sortType === "recommended"
                            ? "영상에 하트를 눌러 추천 영상을 만들어보세요"
                            : "다른 태그를 선택해보세요"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {currentVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                thumbnail={video.thumbnail}
                                title={video.title}
                                duration={video.duration}
                                views={video.views}
                                uploadDate={video.uploadDate}
                                videoId={video.id}
                                isFavorite={video.isFavorite}
                                onFavoriteToggle={onFavoriteToggle}
                            />
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="이전 페이지"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex gap-1">
                                {getPageNumbers().map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page === "..." ? (
                                            <span className="px-3 py-2 text-gray-400">...</span>
                                        ) : (
                                            <button
                                                onClick={() => setCurrentPage(page as number)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === page
                                                        ? "bg-primary text-white shadow-sm"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                title="다음 페이지"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VideoListSection;