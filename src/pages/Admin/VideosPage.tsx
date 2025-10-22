import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import UploadVideoModal from "@/components/Admin/Video/UploadVideoModal";
import EditVideoModal from "@/components/Admin/Video/EditVideoModal";

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

const generateDummyVideos = (count: number): Video[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `샘플 동영상 ${i + 1}`,
    thumbnail: "/thum.png",
    isPublic: i % 3 !== 0,
    visibility: i % 3 === 0 ? "private" : i % 2 === 0 ? "organization" : "group",
    createdAt: `2025-0${(i % 9) + 1}-${String((i * 2) % 28 + 1).padStart(2, "0")}`,
    expireAt: i % 4 === 0 ? "" : `2025-0${(i % 9) + 1}-${String((i * 3) % 28 + 5).padStart(2, "0")}`,
    views: Math.floor(Math.random() * 5000 + 100),
  }));

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(generateDummyVideos(25));

  // 업로드 & 수정 모달 상태
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // 필터 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "oldest" | "views">("latest");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "private" | "group"
  >("all");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 업로드
  const handleVideoUpload = (data: any) => {
    const newVideo: Video = {
      id: Date.now(),
      title: data.title,
      thumbnail: data.thumbnail ? URL.createObjectURL(data.thumbnail) : "/default-thumb.jpg",
      isPublic: data.visibility !== "private",
      visibility: data.visibility,
      createdAt: new Date().toISOString().split("T")[0],
      expireAt: data.customDate || "",
      views: 0,
    };
    setVideos((prev) => [newVideo, ...prev]);
    setShowUploadModal(false);
  };

  // 수정
  const handleVideoEdit = (updated: Video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? { ...v, ...updated } : v))
    );
    setEditingVideo(null);
  };

  // 삭제
  const handleDelete = (id: number) => {
    if (confirm("정말로 이 영상을 삭제하시겠습니까?")) {
      setVideos(videos.filter((v) => v.id !== id));
    }
  };

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

    // 검색 필터
    if (searchTerm.trim()) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 공개 범위 필터
    if (visibilityFilter !== "all") {
      result = result.filter((v) => v.visibility === visibilityFilter);
    }

    // 정렬
    if (sortType === "latest") {
      result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (sortType === "oldest") {
      result.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    } else if (sortType === "views") {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [videos, searchTerm, sortType, visibilityFilter]);

  // 페이지 처리
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">동영상 관리</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition"
          >
            <Plus size={18} />
            새 동영상 업로드
          </button>
        </div>
      </div>

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
            onChange={(e) => {
              setVisibilityFilter(e.target.value as any);
              setCurrentPage(1);
            }}
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
              <th className="p-3">공개 범위</th>
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
                    alt={video.title}
                    className="w-20 h-12 rounded object-cover"
                  />
                </td>
                <td className="p-3 font-medium text-gray-800">{video.title}</td>
                <td className="p-3 text-gray-600">{video.createdAt}</td>
                <td className="p-3 text-gray-600">
                  {video.expireAt ? (
                    <span>{video.expireAt}</span>
                  ) : (
                    <span className="text-gray-400 text-xs">만료 없음</span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${video.visibility === "organization"
                        ? "bg-green-100 text-green-700"
                        : video.visibility === "group"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {video.visibility === "organization"
                      ? "조직 전체"
                      : video.visibility === "group"
                        ? "특정 그룹"
                        : "비공개"}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{video.views.toLocaleString()}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <Link
                    to={`/video/${video.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
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

      {/* 페이지네이션 + 페이지 크기 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {/* 페이지 크기 선택 */}
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

          {/* 페이지 번호 */}
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
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === i + 1
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

      {/* 업로드 모달 */}
      {showUploadModal && (
        <UploadVideoModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleVideoUpload}
        />
      )}
      {/* 수정 모달 */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onClose={() => setEditingVideo(null)}
          onSubmit={handleVideoEdit}
        />
      )}
    </div>
  );
};

export default VideosPage;