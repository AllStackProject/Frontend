import React, { useState, useMemo } from "react";
import { Filter, RotateCcw, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import EditQuizModal from "@/components/admin/quiz/EditQuizModal";
import type { VideoQuiz } from "@/types/AdminQuiz";

const dummyQuizVideos: VideoQuiz[] = [
  {
    id: 1,
    title: "AI 트렌드 2025",
    uploader: "홍길동",
    uploadDate: "2025-10-10",
    expireAt: "2025-11-10",
    visibility: "organization",
    hasAIQuiz: true,
    quizzes: [
      { id: 1, question: "AI는 인간의 감정을 완벽히 이해한다.", answer: "X" },
      { id: 2, question: "머신러닝은 AI의 한 분야이다.", answer: "O" },
      { id: 3, question: "딥러닝은 데이터가 적을수록 좋다.", answer: "X" },
    ],
  },
  {
    id: 2,
    title: "AI 윤리와 프라이버시",
    uploader: "박민지",
    uploadDate: "2025-09-12",
    expireAt: "2025-10-12",
    visibility: "group",
    hasAIQuiz: true,
    quizzes: [
      { id: 1, question: "AI는 항상 윤리적으로 사용된다.", answer: "X" },
      { id: 2, question: "프라이버시는 AI 설계에서 중요하다.", answer: "O" },
      { id: 3, question: "데이터 동의 없이 AI를 학습시켜도 된다.", answer: "X" },
    ],
  },
];

const QuizSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoQuiz[]>(dummyQuizVideos);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "group" | "private"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedVideo, setSelectedVideo] = useState<VideoQuiz | null>(null);

  // 필터링
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase());
      const matchesVisibility =
        visibilityFilter === "all" || v.visibility === visibilityFilter;
      return matchesSearch && matchesVisibility && v.hasAIQuiz;
    });
  }, [videos, search, visibilityFilter]);

  // 페이징
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch("");
    setVisibilityFilter("all");
    setCurrentPage(1);
  };

  return (
    <div>
      {/* 필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="동영상 제목 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">전체 공개범위</option>
              <option value="organization">조직 전체공개</option>
              <option value="group">특정 그룹공개</option>
              <option value="private">비공개</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="px-4 py-3 font-semibold">동영상 제목</th>
              <th className="px-4 py-3 font-semibold">업로더</th>
              <th className="px-4 py-3 font-semibold">업로드일</th>
              <th className="px-4 py-3 font-semibold">만료일</th>
              <th className="px-4 py-3 font-semibold">공개 범위</th>
              <th className="px-4 py-3 font-semibold text-center">AI 퀴즈 관리</th>
            </tr>
          </thead>
          <tbody>
            {currentVideos.map((video, index) => (
              <tr
                key={video.id}
                className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{video.title}</td>
                <td className="px-4 py-3 text-gray-600">{video.uploader}</td>
                <td className="px-4 py-3 text-gray-600">{video.uploadDate}</td>
                <td className="px-4 py-3 text-gray-600">
                  {video.expireAt ? (
                    <span>{video.expireAt}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">만료 없음</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      video.visibility === "organization"
                        ? "bg-green-100 text-green-700"
                        : video.visibility === "group"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {video.visibility === "organization"
                      ? "조직 전체"
                      : video.visibility === "group"
                      ? "특정 그룹"
                      : "비공개"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    <Eye size={14} /> 관리
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentVideos.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            AI 퀴즈가 생성된 영상이 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">페이지당 표시:</span>
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
          </select>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

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

      {/* 모달 */}
      {selectedVideo && (
        <EditQuizModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onSave={(updated: VideoQuiz) => {
            setVideos((prev: VideoQuiz[]) =>
              prev.map((v) => (v.id === updated.id ? updated : v))
            );
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default QuizSection;