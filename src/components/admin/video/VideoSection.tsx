import React, { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Trash2,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { getAdminOrgVideos, deleteAdminOrgVideo } from "@/api/adminVideo/orgVideos";

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  visibility: "organization" | "private" | "group";
  createdAt: string;
  expireAt?: string;
  views: number;
}

const VideoSection: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const { orgId } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<"latest" | "oldest" | "views">("latest");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "all" | "organization" | "private" | "group"
  >("all");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatExpireDate = (dateString?: string) => {
    if (!dateString) return "만료 없음";

    const expireDate = new Date(dateString);
    const now = new Date();
    const yearsDiff = (expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // 100년 이상이면 만료 없음으로 처리
    if (yearsDiff >= 100) {
      return "만료 없음";
    }

    return formatDate(dateString);
  };

  const loadVideos = async () => {
    try {
      const res = await getAdminOrgVideos(orgId || 0);

      const mapped: Video[] = res.map((v: any) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail_url,
        visibility:
          v.open_scope === "PUBLIC"
            ? "organization"
            : v.open_scope === "PRIVATE"
              ? "private"
              : "group",
        createdAt: v.created_at,
        expireAt: v.expired_at,
        views: v.view_cnt,
      }));

      setVideos(mapped);
    } catch (err) {
      console.error("🚨 영상 로드 실패:", err);
    } finally {
      
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleDeleteClick = (video: Video) => {
    openModal({
      type: "confirm",
      title: "동영상 삭제",
      message: `"${video.title}"을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      requiredKeyword: "삭제",
      confirmText: "삭제",
      onConfirm: () => handleDeleteConfirm(video),
    });
  };

  const handleDeleteConfirm = async (video: Video) => {
    try {
      const res = await deleteAdminOrgVideo(orgId || 0, video.id);

      if (res.success) {
        closeModal();

        openModal({
          type: "success",
          title: "삭제 완료",
          message: "영상이 삭제되었습니다.",
          autoClose: true,
          autoCloseDelay: 1800,
        });

        await loadVideos();
      }
    } catch (err: any) {
      openModal({
        type: "error",
        title: "삭제 실패",
        message: err.message || "영상 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  const filteredVideos = useMemo(() => {
    let list = [...videos];

    if (searchTerm.trim()) {
      list = list.filter((v) =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (visibilityFilter !== "all") {
      list = list.filter((v) => v.visibility === visibilityFilter);
    }

    if (sortType === "latest") {
      list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    } else if (sortType === "oldest") {
      list.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    } else {
      list.sort((a, b) => b.views - a.views);
    }

    return list;
  }, [videos, searchTerm, sortType, visibilityFilter]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentVideos = filteredVideos.slice(
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

  return (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* 검색 */}
          <div className="flex items-center gap-2 flex-1">
            <Filter size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="제목으로 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            <select
              value={visibilityFilter}
              onChange={(e) => {
                setVisibilityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">전체 공개 범위</option>
              <option value="organization">조직 전체 공개</option>
              <option value="group">특정 그룹 공개</option>
              <option value="private">비공개</option>
            </select>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="views">조회수순</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSortType("latest");
                setVisibilityFilter("all");
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-600"
            >
              <RotateCcw size={16} />
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600">
              <th className="p-3">썸네일</th>
              <th className="p-3">제목</th>
              <th className="p-3">업로드일</th>
              <th className="p-3">만료일</th>
              <th className="p-3">공개 범위</th>
              <th className="p-3">조회수</th>
              <th className="p-3 text-center">관리</th>
            </tr>
          </thead>

          <tbody>
            {currentVideos.map((video) => (
              <tr key={video.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-20 h-12 rounded object-cover border"
                  />
                </td>

                <td className="p-3">{video.title}</td>

                <td className="p-3 text-gray-600">
                  {formatDate(video.createdAt)}
                </td>

                <td className="p-3">
                  {formatExpireDate(video.expireAt)}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${video.visibility === "organization"
                      ? "bg-green-100 text-green-700"
                      : video.visibility === "group"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {video.visibility === "organization"
                      ? "조직 전체"
                      : video.visibility === "group"
                        ? "그룹 공개"
                        : "비공개"}
                  </span>
                </td>

                <td className="p-3">{video.views}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/video/${video.id}`}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye size={16} />
                    </Link>

                    <button
                      onClick={() => handleDeleteClick(video)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentVideos.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            등록된 영상이 없습니다.
          </div>
        )}
      </div>

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
    </div>
  );
};

export default VideoSection;