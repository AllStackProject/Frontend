import React, { useState, useMemo } from "react";
import { Filter, RotateCcw, Eye, ChevronLeft, ChevronRight, Info } from "lucide-react";
import WatchUserModal from "@/components/Admin/History/WatchUserModal";

interface WatchRecord {
  id: number;
  video: string;
  uploader: string;
  uploadDate: string;
  expireAt?: string;
  visibility: "organization" | "group" | "private";
  viewRate: number;
  viewers: number;
}

const dummyRecords: WatchRecord[] = [
  {
    id: 1,
    video: "AI 트렌드 2025",
    uploader: "홍길동",
    uploadDate: "2025-10-10",
    expireAt: "2025-11-10",
    visibility: "organization",
    viewRate: 82,
    viewers: 56,
  },
  {
    id: 2,
    video: "딥러닝 기초 강의",
    uploader: "이영희",
    uploadDate: "2025-09-15",
    expireAt: "",
    visibility: "group",
    viewRate: 63,
    viewers: 34,
  },
  {
    id: 3,
    video: "AI 윤리와 프라이버시",
    uploader: "박철수",
    uploadDate: "2025-08-21",
    expireAt: "2025-09-21",
    visibility: "organization",
    viewRate: 91,
    viewers: 68,
  },
  {
    id: 4,
    video: "R&D 워크샵",
    uploader: "이수현",
    uploadDate: "2025-10-01",
    visibility: "private",
    viewRate: 45,
    viewers: 18,
  },
  {
    id: 5,
    video: "AI 데이터 동의 안내",
    uploader: "최지훈",
    uploadDate: "2025-07-19",
    expireAt: "",
    visibility: "organization",
    viewRate: 72,
    viewers: 40,
  },
];

const VideoWatchSection: React.FC = () => {
  const [records] = useState<WatchRecord[]>(dummyRecords);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "group" | "private"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedVideo, setSelectedVideo] = useState<WatchRecord | null>(null);

  // 필터링
  const filteredRecords = useMemo(() => {
    return records.filter((v) => {
      const matchesSearch =
        v.video.toLowerCase().includes(search.toLowerCase()) ||
        v.uploader.toLowerCase().includes(search.toLowerCase());
      const matchesVisibility =
        visibilityFilter === "all" || v.visibility === visibilityFilter;
      return matchesSearch && matchesVisibility;
    });
  }, [records, search, visibilityFilter]);

  // 페이징
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
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
              placeholder="영상 제목 또는 업로더 검색"
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
              <th className="px-4 py-3 font-semibold">영상 제목</th>
              <th className="px-4 py-3 font-semibold">업로더</th>
              <th className="px-4 py-3 font-semibold">업로드일</th>
              <th className="px-4 py-3 font-semibold">만료일</th>
              <th className="px-4 py-3 font-semibold">공개 범위</th>
              <th className="px-4 py-3 font-semibold w-52">
                <div className="flex items-center gap-1 relative group">
                  시청 완료율
                  <Info
                    size={15}
                    className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  />
                  {/* Tooltip */}
                  <div className="absolute left-28 top-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 z-10">
                    <p className="font-semibold mb-1">시청 완료율이란?</p>
                    <p className="text-gray-200">
                      시청한 멤버 중 해당 영상을 90% 이상 시청 완료한 멤버의 비율입니다.
                    </p>
                    <p className="mt-2 text-gray-300 text-[11px]">
                      계산식: (시청 완료 멤버 ÷ 전체 시청자) × 100
                    </p>
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 font-semibold text-center">시청자 수</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((r, index) => (
              <tr
                key={r.id}
                className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{r.video}</td>
                <td className="px-4 py-3 text-gray-600">{r.uploader}</td>
                <td className="px-4 py-3 text-gray-600">{r.uploadDate}</td>
                <td className="px-4 py-3 text-gray-600">
                  {r.expireAt ? (
                    <span>{r.expireAt}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">만료 없음</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${r.visibility === "organization"
                      ? "bg-green-100 text-green-700"
                      : r.visibility === "group"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {r.visibility === "organization"
                      ? "조직 전체"
                      : r.visibility === "group"
                        ? "특정 그룹"
                        : "비공개"}
                  </span>
                </td>

                {/* 시청률 그래프 */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${r.viewRate >= 80
                          ? "bg-green-500"
                          : r.viewRate >= 50
                            ? "bg-blue-500"
                            : "bg-red-400"
                          }`}
                        style={{ width: `${r.viewRate}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold min-w-[45px] ${r.viewRate >= 80
                        ? "text-green-600"
                        : r.viewRate >= 50
                          ? "text-blue-600"
                          : "text-red-500"
                        }`}
                    >
                      {r.viewRate}%
                    </span>
                  </div>
                </td>

                {/* 시청자 수 */}
                <td
                  onClick={() => setSelectedVideo(r)}
                  className="px-4 py-3 text-center cursor-pointer transition-all duration-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-center gap-1.5 text-gray-700 group">
                    <Eye
                      size={15}
                      className="text-gray-500 transition-colors duration-200 group-hover:text-blue-600"
                    />
                    <span
                      className="font-medium text-sm transition-all duration-200 group-hover:text-blue-700 group-hover:font-semibold"
                    >
                      {r.viewers.toLocaleString()}명
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentRecords.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            검색 결과가 없습니다.
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
                  className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
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
        <WatchUserModal
          video={{ title: selectedVideo.video }}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoWatchSection;