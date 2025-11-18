import React, { useState, useEffect } from "react";
import { Eye, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import VideoAnalyticsModal from "./VideoAnalyticsModal";
import { fetchIntervalList } from "@/api/admin/report";

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
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

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
      }
    };

    load();
  }, [orgId]);

  const totalPages = Math.ceil(videos.length / itemsPerPage);
  const currentItems = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              className={`border-b hover:bg-blue-50 transition-colors cursor-pointer ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              }`}
              onClick={() => setSelectedVideo(v)}
            >
              <td className="px-4 py-3 font-medium text-gray-800">{v.title}</td>
              <td className="px-4 py-3 text-gray-600">{v.uploader}</td>
              <td className="px-4 py-3 text-center">{v.totalViewers} 명</td>
              <td
                className={`px-4 py-3 text-center font-semibold ${
                  v.dropOffRate >= 90
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
          데이터가 없습니다.
        </div>
      )}

      {/* 페이징 */}
      <div className="flex justify-end items-center mt-5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`min-w-[32px] px-2 py-1 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
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