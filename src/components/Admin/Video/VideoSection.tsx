import React, { useState, useMemo } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import SuccessModal from "@/components/common/modals/SuccessModal";

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

interface VideoManagementSectionProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDelete: (id: number) => void;
}

const VideoManagementSection: React.FC<VideoManagementSectionProps> = ({
  videos,
  onEdit,
  onDelete,
}) => {
  // 필터 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "oldest" | "views">("latest");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "private" | "group"
  >("all");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // 모달 상태
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setSortType("latest");
    setVisibilityFilter("all");
    setCurrentPage(1);
  };

  // 삭제 확인 열기
  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setShowDeleteConfirm(true);
  };

  // 삭제 실행
  const handleDeleteConfirm = () => {
    if (selectedVideo) {
      onDelete(selectedVideo.id);
      setShowDeleteConfirm(false);
      setSuccessMessage({
        title: "삭제 완료",
        message: `"${selectedVideo.title}"가 삭제되었습니다.`,
      });
      setShowSuccessModal(true);
      setSelectedVideo(null);
    }
  };

  // 수정 확인 열기
  const handleEditClick = (video: Video) => {
    setSelectedVideo(video);
    setShowEditConfirm(true);
  };

  // 수정 실행
  const handleEditConfirm = () => {
    if (selectedVideo) {
      onEdit(selectedVideo);
      setShowEditConfirm(false);
      setSelectedVideo(null);
    }
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

  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-5">
      {/* 필터 영역 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* 검색 */}
          <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="제목으로 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 필터 */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 공개 범위</option>
              <option value="organization">조직 전체공개</option>
              <option value="group">특정 그룹 공개</option>
              <option value="private">비공개</option>
            </select>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">최신순</option>
              <option value="oldest">등록일 오래된순</option>
              <option value="views">조회수순</option>
            </select>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-600 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition font-medium"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="p-3 font-semibold">썸네일</th>
                <th className="p-3 font-semibold">제목</th>
                <th className="p-3 font-semibold">등록일</th>
                <th className="p-3 font-semibold">만료일</th>
                <th className="p-3 font-semibold">공개 범위</th>
                <th className="p-3 font-semibold">조회수</th>
                <th className="p-3 font-semibold text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {currentVideos.map((video) => (
                <tr key={video.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 rounded object-cover border border-gray-200"
                    />
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {video.title}
                    </p>
                  </td>
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
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        video.visibility === "organization"
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
                  <td className="p-3 text-gray-700 font-medium">
                    {video.views.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/video/${video.id}`}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="미리보기"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => handleEditClick(video)}
                        className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg transition"
                        title="수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(video)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentVideos.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <p className="text-lg mb-2">등록된 동영상이 없습니다.</p>
            <p className="text-sm">새 동영상을 업로드해보세요.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* 페이지당 표시 개수 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>페이지당 표시:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
            </select>
          </div>

          {/* 페이지 번호 */}
          <div className="flex items-center gap-2">
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
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
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

          {/* 페이지 정보 */}
          <div className="text-sm text-gray-600">
            {currentPage} / {totalPages} 페이지
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && selectedVideo && (
        <ConfirmActionModal
          title="동영상 삭제"
          message={`"${selectedVideo.title}"를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
          keyword="삭제"
          confirmText="삭제"
          color="red"
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {/* 수정 확인 모달 */}
      {showEditConfirm && selectedVideo && (
        <ConfirmActionModal
          title="동영상 수정"
          message={`"${selectedVideo.title}"를 수정하시겠습니까?`}
          confirmText="수정"
          color="yellow"
          onConfirm={handleEditConfirm}
          onClose={() => {
            setShowEditConfirm(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          title={successMessage.title}
          message={successMessage.message}
          autoClose={true}
          autoCloseDelay={2000}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default VideoManagementSection;