import React, { useState, useMemo } from "react";
import {
    Eye,
    Edit,
    Trash2,
    Filter,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    PlayCircle, Link
} from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import SuccessModal from "@/components/common/modals/SuccessModal";

interface Video {
    id: number;
    name: string;
    img: string;
    visibility: "organization" | "private" | "group";
    created_at: string;
    expire_at?: string;
    views: number;
}

interface VideoManagementSectionProps {
    videos: Video[];
    onEdit: (video: Video) => void;
    onDelete: (id: number) => void;
}

// 더미 데이터
const DUMMY_VIDEOS: Video[] = [
    {
        id: 1,
        name: "React 완벽 가이드 - 기초부터 심화까지",
        img: "/dummy/thum1.png",
        visibility: "organization",
        created_at: "2025-01-15T10:30:00Z",
        expire_at: "2025-02-15T10:30:00Z",
        views: 1250,
    },
    {
        id: 2,
        name: "TypeScript 마스터하기",
        img: "/dummy/thum2.png",
        visibility: "group",
        created_at: "2025-01-10T14:20:00Z",
        views: 890,
    },
    {
        id: 3,
        name: "Next.js 14 신규 기능 소개",
        img: "/dummy/thum3.png",
        visibility: "organization",
        created_at: "2025-01-08T09:15:00Z",
        expire_at: "2025-03-08T09:15:00Z",
        views: 2340,
    },
    {
        id: 4,
        name: "내부 교육자료 - 보안 정책",
        img: "/dummy/thum4.png",
        visibility: "private",
        created_at: "2025-01-05T16:45:00Z",
        views: 156,
    },
    {
        id: 5,
        name: "2025 신입사원 온보딩 가이드",
        img: "/dummy/thum5.png",
        visibility: "group",
        created_at: "2025-01-03T11:00:00Z",
        expire_at: "2025-07-03T11:00:00Z",
        views: 567,
    },
    {
        id: 6,
        name: "Git & GitHub 실무 활용법",
        img: "/dummy/thum6.png",
        visibility: "organization",
        created_at: "2024-12-28T13:30:00Z",
        views: 1890,
    },
    {
        id: 7,
        name: "Docker & Kubernetes 입문",
        img: "/dummy/thum7.png",
        visibility: "organization",
        created_at: "2024-12-20T15:20:00Z",
        expire_at: "2025-06-20T15:20:00Z",
        views: 3240,
    },
    {
        id: 8,
        name: "팀 프로젝트 회고 미팅",
        img: "/dummy/thum8.png",
        visibility: "private",
        created_at: "2024-12-15T10:00:00Z",
        views: 45,
    },
];

const MyVideoSection: React.FC<VideoManagementSectionProps> = ({
    videos = DUMMY_VIDEOS,
    onEdit,
    onDelete,
}) => {
    const orgName = localStorage.getItem("org_name") || "조직";
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
                message: `"${selectedVideo.name}"가 삭제되었습니다.`,
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

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 정렬 + 필터링 처리
    const filteredVideos = useMemo(() => {
        let result = [...videos];

        // 검색 필터
        if (searchTerm.trim()) {
            result = result.filter((v) =>
                v.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 공개 범위 필터
        if (visibilityFilter !== "all") {
            result = result.filter((v) => v.visibility === visibilityFilter);
        }

        // 정렬
        if (sortType === "latest") {
            result.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        } else if (sortType === "oldest") {
            result.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
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

    if (videos.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg border border-border-light">
                <PlayCircle className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-text-muted text-sm">
                    {orgName}에서 업로드한 영상이 없습니다.
                </p>
                <p className="text-text-muted text-xs mt-2">
                    우측 하단 + 버튼으로 영상을 업로드해보세요!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* 타이틀 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-text-primary">업로드한 영상</h2>
                    <span className="text-sm text-text-muted">({videos.length}개)</span>
                </div>
            </div>

            {/* 필터 영역 */}
            <div className="bg-white border border-border-light rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* 검색 */}
                    <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
                        <Filter size={18} className="text-text-muted" />
                        <input
                            type="text"
                            placeholder="제목으로 검색..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1 border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                            className="border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">모든 공개범위</option>
                            <option value="organization">전체공개</option>
                            <option value="group">그룹 공개</option>
                            <option value="private">비공개</option>
                        </select>

                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value as any)}
                            className="border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="latest">최신순</option>
                            <option value="oldest">등록일 오래된순</option>
                            <option value="views">조회수순</option>
                        </select>

                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 text-text-secondary border border-border-light rounded-lg px-3 py-2 text-sm hover:bg-bg-page transition font-medium"
                        >
                            <RotateCcw size={16} />
                            <span className="hidden sm:inline">초기화</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white border border-border-light rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-bg-page border-b border-border-light">
                            <tr className="text-left text-text-secondary">
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
                                <tr
                                    key={video.id}
                                    className="border-b border-border-light hover:bg-bg-page transition"
                                >
                                    <td className="p-3">
                                        <img
                                            src={video.img}
                                            alt={video.name}
                                            className="w-20 h-12 rounded object-cover border border-border-light"
                                            onError={(e) => {
                                                e.currentTarget.src = "/dummy/video-thumb.png";
                                            }}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <p className="font-medium text-text-primary line-clamp-1">
                                            {video.name}
                                        </p>
                                    </td>
                                    <td className="p-3 text-text-secondary">
                                        {formatDate(video.created_at)}
                                    </td>
                                    <td className="p-3 text-text-secondary">
                                        {video.expire_at ? (
                                            <span>{formatDate(video.expire_at)}</span>
                                        ) : (
                                            <span className="text-text-muted text-xs">만료 없음</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${video.visibility === "organization"
                                                ? "bg-success/10 text-success"
                                                : video.visibility === "group"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-gray-200 text-text-secondary"
                                                }`}
                                        >
                                            {video.visibility === "organization"
                                                ? "전체"
                                                : video.visibility === "group"
                                                    ? "그룹"
                                                    : "비공개"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-text-primary font-medium">
                                        {video.views.toLocaleString()}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/video/${video.id}`}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                name="미리보기"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleEditClick(video)}
                                                className="p-2 text-warning hover:bg-warning/10 rounded-lg transition"
                                                title="수정"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(video)}
                                                className="p-2 text-error hover:bg-error/10 rounded-lg transition"
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
                    <div className="text-center text-text-muted py-16">
                        <p className="text-lg mb-2">검색 결과가 없습니다.</p>
                        <p className="text-sm">다른 검색어를 입력해보세요.</p>
                    </div>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* 페이지당 표시 개수 */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span>페이지당 표시:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-border-light rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        <span className="px-3 py-2 text-text-muted">...</span>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage(page as number)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === page
                                                ? "bg-primary text-white shadow-sm"
                                                : "bg-gray-100 text-text-secondary hover:bg-gray-200"
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
                    <div className="text-sm text-text-secondary">
                        {currentPage} / {totalPages} 페이지
                    </div>
                </div>
            )}

            {/* 수정 확인 모달 */}
            {showEditConfirm && selectedVideo && (
                <ConfirmActionModal
                    title="동영상 수정"
                    message={`"${selectedVideo.name}"를 수정하시겠습니까?`}
                    confirmText="수정"
                    color="yellow"
                    onConfirm={handleEditConfirm}
                    onClose={() => {
                        setShowEditConfirm(false);
                        setSelectedVideo(null);
                    }}
                />
            )}
            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && selectedVideo && (
                <ConfirmActionModal
                    title="동영상 삭제"
                    message={`"${selectedVideo.name}"를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
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

export default MyVideoSection;