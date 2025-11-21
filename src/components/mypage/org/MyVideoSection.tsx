import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    Edit,
    Trash2,
    Filter,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    PlayCircle,
} from "lucide-react";

import { useModal } from "@/context/ModalContext";
import EditVideoModal from "@/components/mypage/org/EditVideoModal";
import VideoStatsModal from "@/components/mypage/org/VideoStatsModal";
import { useAuth } from "@/context/AuthContext";
import { fetchMyUploadedVideos, fetchMyVideoStats } from "@/api/myactivity/video";

interface Video {
    id: number;
    name: string;
    img: string;
    visibility: "organization" | "private" | "group";
    created_at: string;
    expire_at?: string | null;
    views: number;
}

const MyVideoSection: React.FC = () => {
    const { orgId, orgName } = useAuth();
    const { openModal } = useModal();

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    // ===== 필터 및 정렬 =====
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState<"latest" | "oldest" | "views">(
        "latest"
    );
    const [visibilityFilter, setVisibilityFilter] = useState<
        "all" | "organization" | "private" | "group"
    >("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    //  모달 상태 
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [videoStats, setVideoStats] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    /* ============================================================
        API 호출
    ============================================================ */
    useEffect(() => {
        if (!orgId) return;

        const load = async () => {
            setLoading(true);
            try {
                const raw = await fetchMyUploadedVideos(orgId);

                const mapped: Video[] = raw.map((v) => ({
                    id: v.id,
                    name: v.title,
                    img: v.thumbnail_url,
                    visibility:
                        v.open_scope === "PUBLIC"
                            ? "organization"
                            : v.open_scope === "GROUP"
                                ? "group"
                                : "private",
                    created_at: v.created_at,
                    expire_at: v.expired_at,
                    views: v.view_cnt,
                }));

                setVideos(mapped);
            } catch (err) {
                console.error("❌ 내 영상 목록 로드 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [orgId]);

    /* ============================================================
        핸들러들
    ============================================================ */

    const handleDeleteClick = (video: Video) => {
        setSelectedVideo(video);

        openModal({
            type: "delete",
            title: "정말 삭제하시겠습니까?",
            message: `"${video.name}"을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
            requiredKeyword: "삭제",
            onConfirm: () => handleDeleteConfirm(video),
        });
    };

    const handleDeleteConfirm = (video: Video) => {
        setVideos((prev) => prev.filter((v) => v.id !== video.id));

        openModal({
            type: "success",
            title: "삭제 완료",
            message: `"${video.name}" 영상이 삭제되었습니다.`,
            autoClose: true,
            autoCloseDelay: 1800,
        });
    };

    const handleEditClick = (video: Video) => {
        setSelectedVideo(video);
        setShowEditModal(true);
    };

    const handleEditSubmit = (data: any) => {
        console.log("🔥 수정된 데이터:", data);

        // (1) 실제 API를 이곳에서 호출하면 됨
        // await updateVideo(video.id, data);

        // (2) 로컬 UI 업데이트 (옵션)
        setVideos((prev) =>
            prev.map((v) => (v.id === data.id ? { ...v, ...data } : v))
        );

        openModal({
            type: "success",
            title: "수정 완료",
            message: "영상 정보가 성공적으로 수정되었습니다.",
            autoClose: true,
            autoCloseDelay: 1800,
        });
    };

    const handleStatsClick = async (video: Video) => {
        if (!orgId) return;

        try {
            const stats = await fetchMyVideoStats(orgId, video.id);
            setVideoStats(stats);
            setSelectedVideo(video);
            setShowStatsModal(true);
        } catch (err) {
            console.error(err);
            alert("통계를 불러올 수 없습니다.");
        }
    };

    const resetFilters = () => {
        setSearchTerm("");
        setSortType("latest");
        setVisibilityFilter("all");
        setCurrentPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ko-KR");
    };

    /* ============================================================
        검색 + 필터 + 정렬
    ============================================================ */
    const filteredVideos = useMemo(() => {
        let result = [...videos];

        if (searchTerm.trim()) {
            result = result.filter((v) =>
                v.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (visibilityFilter !== "all") {
            result = result.filter((v) => v.visibility === visibilityFilter);
        }

        if (sortType === "latest")
            result.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        if (sortType === "oldest")
            result.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
        if (sortType === "views") result.sort((a, b) => b.views - a.views);

        return result;
    }, [videos, searchTerm, sortType, visibilityFilter]);

    /* ============================================================
        페이지네이션
    ============================================================ */
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const currentVideos = filteredVideos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ============================================================
        로딩 화면
    ============================================================ */
    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500">불러오는 중...</div>
        );
    }

    /* ============================================================
        데이터 없음
    ============================================================ */
    if (videos.length === 0) {
        return (
            <div className="text-center py-16 bg-white border rounded-xl">
                <PlayCircle className="mx-auto mb-3 text-gray-300" size={48} />
                <p className="text-gray-500 text-sm">
                    {orgName}에서 업로드한 영상이 없습니다.
                </p>
            </div>
        );
    }

    /* ============================================================
        UI 렌더링
    ============================================================ */
    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-text-primary">업로드한 영상</h2>
                <span className="text-sm text-text-muted">({videos.length}개)</span>
            </div>

            {/* 필터 UI */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    {/* 검색 */}
                    <div className="flex items-center gap-2 flex-1">
                        <Filter size={18} className="text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="제목 검색..."
                            className="border rounded-lg px-3 py-2 text-sm flex-1"
                        />
                    </div>

                    {/* 필터들 */}
                    <div className="flex gap-2">
                        <select
                            value={visibilityFilter}
                            onChange={(e) => setVisibilityFilter(e.target.value as any)}
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="all">전체 공개범위</option>
                            <option value="organization">전체공개</option>
                            <option value="group">그룹공개</option>
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
                            onClick={resetFilters}
                            className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            <RotateCcw size={16} /> 초기화
                        </button>
                    </div>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-left text-gray-600">
                            <th className="p-3">썸네일</th>
                            <th className="p-3">제목</th>
                            <th className="p-3">등록일</th>
                            <th className="p-3">만료일</th>
                            <th className="p-3">공개범위</th>
                            <th className="p-3">조회수</th>
                            <th className="p-3 text-center">관리</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentVideos.map((video) => (
                            <tr key={video.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <img
                                        src={video.img}
                                        alt={video.name}
                                        className="w-20 h-12 object-cover rounded border"
                                    />
                                </td>
                                <td className="p-3">{video.name}</td>
                                <td className="p-3">{formatDate(video.created_at)}</td>
                                <td className="p-3">
                                    {video.expire_at ? formatDate(video.expire_at) : "-"}
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
                                            ? "전체"
                                            : video.visibility === "group"
                                                ? "그룹"
                                                : "비공개"}
                                    </span>
                                </td>
                                <td className="p-3">{video.views}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleStatsClick(video)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            title="통계 보기"
                                        >
                                            <BarChart3 size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleEditClick(video)}
                                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(video)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
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
                    <div className="text-center py-10 text-gray-500">검색 결과 없음</div>
                )}
            </div>

            {/* ===== 페이지네이션 ===== */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">

                    {/* 페이지당 개수 */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>페이지당 표시:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                        >
                            <option value={5}>5개</option>
                            <option value={10}>10개</option>
                            <option value={20}>20개</option>
                            <option value={50}>50개</option>
                        </select>
                    </div>

                    {/* 페이지 번호 계산 */}
                    <div className="flex items-center gap-2">

                        {/* 이전 버튼 */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {/* 페이지 번호 */}
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === page
                                        ? "bg-primary text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        {/* 다음 버튼 */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* 모달  */}
            {showStatsModal && selectedVideo && (
                <VideoStatsModal
                    video={selectedVideo}
                    orgId={Number(orgId)}
                    onClose={() => setShowStatsModal(false)}
                />
            )}

            {showEditModal && selectedVideo && (
                <EditVideoModal
                    video={selectedVideo}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedVideo(null);
                    }}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default MyVideoSection;