import React, { useState, useEffect } from "react";
import { Eye, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import VideoAnalyticsModal from "./VideoAnalyticsModal";
import { fetchIntervalList } from "@/api/adminStats/report";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface VideoData {
  id: number;
  title: string;
  uploader: string;
  totalViewers: number;
  dropOffRate: number;
}

const VideoAnalyticsSection: React.FC = () => {
  const orgId = Number(localStorage.getItem("org_id"));
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // 페이징
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await fetchIntervalList(orgId);

        const mapped: VideoData[] = raw.map((v: any) => ({
          id: v.id,
          title: v.title,
          uploader: v.creator,
          totalViewers: v.watch_member_cnt,
          dropOffRate: v.quit_rate,
        }));

        setVideos(mapped);
      } catch (e) {
        console.error("❌ 구간 목록 로딩 실패:", e);
      }finally{
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  /* ---------------------------------------------------------
     6) 페이징 처리
  --------------------------------------------------------- */
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  const currentItems = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
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

  if (loading) return <LoadingSpinner text="로딩 중..." />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="text-blue-600" /> 동영상별 시청 구간 분석
      </h2>

      {/* 테이블 */}
      <table className="min-w-full text-sm border-t border-gray-100">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-3 text-left font-semibold">제목</th>
            <th className="px-4 py-3 text-left font-semibold">업로더</th>
            <th className="px-4 py-3 text-center font-semibold">시청자 수</th>
            <th className="px-4 py-3 text-center font-semibold">중도 이탈률</th>
            <th className="px-4 py-3 text-center font-semibold">분석 보기</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((v, i) => (
            <tr
              key={v.id}
              className={`border-b hover:bg-blue-50 transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              onClick={() => setSelectedVideo(v)}>
              <td
                className="
                  px-4 py-3 font-medium text-gray-800 
                  max-w-[400px] whitespace-nowrap overflow-hidden text-ellipsis block
                "
              >
                {v.title}
              </td>
              <td className="px-4 py-3 text-gray-600">{v.uploader}</td>
              <td className="px-4 py-3 text-center">{v.totalViewers} 명</td>
              <td
                className={`px-4 py-3 text-center font-semibold ${v.dropOffRate >= 90
                    ? "text-red-600"
                    : v.dropOffRate >= 50
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
              >
                {v.dropOffRate}%
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-1 text-blue-600">
                  <Eye size={16} /> 분석
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentItems.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          아직 데이터가 없습니다.
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        {/* 페이지당 표시 개수 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">페이지당:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
            <option value={50}>50개</option>
          </select>
        </div>

        {/* 스마트 페이지네이션 */}
        {totalPages > 0 && (
          <div className="flex justify-center items-center gap-2">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 페이지 번호 */}
            <div className="flex gap-1">
              {getPageNumbers().map((page, idx) => (
                <React.Fragment key={idx}>
                  {page === "..." ? (
                    <span className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      onClick={() => setCurrentPage(page as number)}
                      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="다음 페이지"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoAnalyticsModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoAnalyticsSection;