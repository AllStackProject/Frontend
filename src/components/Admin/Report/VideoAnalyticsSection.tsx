import React, { useState } from "react";
import { Eye, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import VideoAnalyticsModal from "./VideoAnalyticsModal";

interface VideoData {
  id: string;
  title: string;
  uploader: string;
  duration: number; // 초 단위
  totalViewers: number;
  dropOffRate: number; // %
}

const dummyVideos: VideoData[] = [
  { id: "v1", title: "AI 개론", uploader: "홍길동", duration: 180, totalViewers: 120, dropOffRate: 32 },
  { id: "v2", title: "딥러닝 입문", uploader: "이수현", duration: 240, totalViewers: 95, dropOffRate: 21 },
  { id: "v3", title: "데이터 시각화 실습", uploader: "박민지", duration: 300, totalViewers: 160, dropOffRate: 45 },
  { id: "v4", title: "AI 퀴즈 가이드", uploader: "최지훈", duration: 210, totalViewers: 130, dropOffRate: 28 },
  { id: "v5", title: "머신러닝 핵심 정리", uploader: "정우성", duration: 260, totalViewers: 75, dropOffRate: 18 },
  { id: "v6", title: "딥러닝 고급 모델링", uploader: "김민지", duration: 400, totalViewers: 200, dropOffRate: 39 },
  { id: "v7", title: "AI 윤리와 사회적 이슈", uploader: "박수현", duration: 180, totalViewers: 150, dropOffRate: 25 },
];

const VideoAnalyticsSection: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

  // ✅ 페이징 처리
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyVideos.length / itemsPerPage);

  const currentItems = dummyVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="text-blue-600" /> 동영상별 시청 구간 분석
      </h2>

      {/* 리스트 테이블 */}
      <table className="min-w-full text-sm border-t border-gray-100">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-3 text-left font-semibold">제목</th>
            <th className="px-4 py-3 text-left font-semibold">업로더</th>
            <th className="px-4 py-3 text-center font-semibold">총 시청자</th>
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
              <td className="px-4 py-3 text-center text-gray-700 font-semibold">{v.totalViewers}</td>
              <td
                className={`px-4 py-3 text-center font-semibold ${
                  v.dropOffRate >= 40
                    ? "text-red-600"
                    : v.dropOffRate >= 25
                    ? "text-orange-500"
                    : "text-green-600"
                }`}
              >
                {v.dropOffRate}%
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
                  <Eye size={16} /> 분석
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 빈 데이터 */}
      {currentItems.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          표시할 동영상이 없습니다.
        </div>
      )}

      {/* ✅ 페이지네이션 */}
      <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
        <span>
          페이지 {currentPage} / {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`min-w-[32px] px-2 py-1 rounded-lg font-medium transition-colors ${
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
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ✅ 모달 */}
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