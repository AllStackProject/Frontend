import React, { useState, useMemo } from "react";
import {
  Filter,
  RotateCcw,
  Edit,
  Trash2,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  visibility: "organization" | "private" | "group";
  createdAt: string;
  expireAt?: string;
  views: number;
}

interface VideoSectionProps {
  onEdit: (video: Video) => void;
  onDelete: (id: number) => void;
}

const generateDummyVideos = (count: number): Video[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `샘플 동영상 ${i + 1}`,
    thumbnail: "/thum.png",
    isPublic: i % 3 !== 0,
    visibility: i % 3 === 0 ? "private" : i % 2 === 0 ? "organization" : "group",
    createdAt: `2025-0${(i % 9) + 1}-${String((i * 2) % 28 + 1).padStart(2, "0")}`,
    expireAt:
      i % 4 === 0
        ? ""
        : `2025-0${(i % 9) + 1}-${String((i * 3) % 28 + 5).padStart(2, "0")}`,
    views: Math.floor(Math.random() * 5000 + 100),
  }));

const VideoSection: React.FC<VideoSectionProps> = ({ onEdit, onDelete }) => {
  const [videos] = useState<Video[]>(generateDummyVideos(25));

  // 필터 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "oldest" | "views">("latest");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "private" | "group"
  >("all");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setSortType("latest");
    setVisibilityFilter("all");
    setCurrentPage(1);
  };

  // 정렬 + 필터링 처리
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (searchTerm.trim()) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (visibilityFilter !== "all") {
      result = result.filter((v) => v.visibility === visibilityFilter);
    }

    if (sortType === "latest") {
      result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (sortType === "oldest") {
      result.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    } else if (sortType === "views") {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [videos, searchTerm, sortType, visibilityFilter]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* 필터 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="제목으로 검색"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">전체</option>
            <option value="organization">조직 전체공개</option>
            <option value="group">특정 그룹 공개</option>
            <option value="private">비공개</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          >
            <option value="latest">최신순</option>
            <option value="oldest">등록일 오래된순</option>
            <option value="views">조회수순</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-gray-600 border border-gray-300 rounded-lg px-3 py-1 text-sm hover:bg-gray-50"
          >
            <RotateCcw size={14} /> 필터 초기화
          </button>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600">
              <th className="p-3">썸네일</th>
              <th className="p-3">제목</th>
              <th className="p-3">등록일</th>
              <th className="p-3">만료일</th>
              <th className="p-3 flex items-center gap-1">
                공개 범위
                <Info size={14} className="text-gray-400 hover:text-gray-600" />
              </th>
              <th className="p-3">조회수</th>
              <th className="p-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentVideos.map((video) => (
              <tr key={video.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">
                  <img
                    src={video.thumbnail}
                    className="w-20 h-12 object-cover rounded"
                    alt={video.title}
                  />
                </td>
                <td className="p-3 font-medium text-gray-800">{video.title}</td>
                <td className="p-3 text-gray-600">{video.createdAt}</td>
                <td className="p-3 text-gray-600">{video.expireAt || "만료 없음"}</td>
                <td className="p-3 text-gray-600">{video.visibility}</td>
                <td className="p-3 text-gray-700">{video.views}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <Link to={`/video/${video.id}`} className="text-blue-500 hover:text-blue-700">
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(video)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(video.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentVideos.length === 0 && (
          <div className="text-center text-gray-400 py-12">등록된 동영상이 없습니다.</div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>페이지당 표시:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
            </select>
          </div>

          <div className="flex justify-center items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
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
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;