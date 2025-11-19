import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Filter, RotateCcw, Eye, BarChart3 } from "lucide-react";
import VideoDetailModal from "@/components/Admin/Learning/VideoDetailModal";
import QuizDetailModal from "@/components/Admin/Learning/QuizDetailModal";

interface UserRecord {
    id: string;
    name: string;
    group: string;
    attendance: number;
    quizScore: string;
}
interface AttendanceSectionProps {
    onOpenReport?: (userId: string) => void;
}

const dummyData: UserRecord[] = [
    { id: "001", name: "김철수", group: "HR팀", attendance: 80, quizScore: "90" },
    { id: "002", name: "박민지", group: "IT팀", attendance: 67, quizScore: "72" },
    { id: "003", name: "이수현", group: "R&D팀", attendance: 75, quizScore: "75" },
    { id: "004", name: "정우성", group: "기획팀", attendance: 85, quizScore: "83" },
    { id: "005", name: "최지훈", group: "HR팀", attendance: 92, quizScore: "95" },
    { id: "006", name: "홍길동", group: "기획팀", attendance: 78, quizScore: "82" },
    { id: "007", name: "이하늘", group: "IT팀", attendance: 88, quizScore: "91" },
    { id: "008", name: "강지민", group: "R&D팀", attendance: 63, quizScore: "70" },
    { id: "009", name: "서윤아", group: "HR팀", attendance: 81, quizScore: "89" },
    { id: "010", name: "유재석", group: "기획팀", attendance: 74, quizScore: "77" },
    { id: "006", name: "홍길동", group: "기획팀", attendance: 78, quizScore: "82" },
    { id: "007", name: "이하늘", group: "IT팀", attendance: 88, quizScore: "91" },
    { id: "008", name: "강지민", group: "R&D팀", attendance: 63, quizScore: "70" },
    { id: "009", name: "서윤아", group: "HR팀", attendance: 81, quizScore: "89" },
    { id: "010", name: "유재석", group: "기획팀", attendance: 74, quizScore: "77" },
];

const GROUPS = ["전체", "HR팀", "IT팀", "R&D팀", "기획팀"];

// 예시 더미 데이터
const watchedVideos = [
    { id: "v01", title: "AI 서비스 소개", watchRate: 90, watchDate: "2025-10-10" },
    { id: "v02", title: "직무교육 1차", watchRate: 75, watchDate: "2025-10-13" },
    { id: "v03", title: "AI 윤리 가이드", watchRate: 60, watchDate: "2025-10-15" },
];

const submittedQuizzes = [
    { id: "q01", videoTitle: "AI 서비스 소개", quizResult: "2/3", answers: ["O", "X", "O"], submittedAt: "2025-10-21" },
    { id: "q02", videoTitle: "직무교육 1차", quizResult: "3/3", answers: ["O", "O", "O"], submittedAt: "2025-10-22" },
];

const AttendanceSection: React.FC<AttendanceSectionProps> = ({ onOpenReport }) => {
    const [filters, setFilters] = useState({ name: "", id: "", group: "전체" });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState("5");
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    // 필터링
    const filteredUsers = useMemo(() => {
        return dummyData.filter(
            (u) =>
                u.name.includes(filters.name) &&
                u.id.includes(filters.id) &&
                (filters.group === "전체" || u.group === filters.group)
        );
    }, [filters]);

    const totalPages = Math.ceil(filteredUsers.length / Number(itemsPerPage));
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * Number(itemsPerPage);
        return filteredUsers.slice(startIndex, startIndex + Number(itemsPerPage));
    }, [filteredUsers, currentPage, itemsPerPage]);

    const resetFilters = () => {
        setFilters({ name: "", id: "", group: "전체" });
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
                            placeholder="이름 검색"
                            value={filters.name}
                            onChange={(e) => {
                                setFilters((prev) => ({ ...prev, name: e.target.value }));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                        <input
                            type="text"
                            placeholder="유저 ID 검색"
                            value={filters.id}
                            onChange={(e) => {
                                setFilters((prev) => ({ ...prev, id: e.target.value }));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                        <select
                            value={filters.group}
                            onChange={(e) => {
                                setFilters((prev) => ({ ...prev, group: e.target.value }));
                                setCurrentPage(1);
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        >
                            {GROUPS.map((g) => (
                                <option key={g} value={g}>
                                    {g}
                                </option>
                            ))}
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
                            <th className="px-4 py-3 font-semibold">유저 ID</th>
                            <th className="px-4 py-3 font-semibold">이름</th>
                            <th className="px-4 py-3 font-semibold">그룹</th>
                            <th className="px-4 py-3 font-semibold">평균 시청률</th>
                            <th className="px-4 py-3 font-semibold">평균 퀴즈 성적</th>
                            <th className="px-4 py-3 font-semibold text-center">상세보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr
                                key={`${user.id}-${index}`}
                                className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                    }`}
                            >
                                <td className="px-4 py-3 text-gray-600">{user.id}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                <td className="px-4 py-3 text-gray-600">{user.group}</td>
                                <td className="px-4 py-3 text-gray-600">{user.attendance}%</td>
                                <td className="px-4 py-3 text-gray-600">{user.quizScore}점</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center items-center gap-3">
                                        {/* 동영상 상세 모달 */}
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowVideoModal(true);
                                            }}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                        >
                                            <Eye size={14} /> 동영상
                                        </button>

                                        {/* AI 퀴즈 상세 모달 */}
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowQuizModal(true);
                                            }}
                                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                                        >
                                            <Eye size={14} /> AI 퀴즈
                                        </button>

                                        {/* 학습 리포트로 이동 */}
                                        <button
                                            onClick={() => onOpenReport?.(user.id)}
                                            className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
                                        >
                                            <BarChart3 size={14} /> 리포트
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentUsers.length === 0 && (
                    <div className="text-center text-gray-500 py-12">검색 결과가 없습니다.</div>
                )}
            </div>

            {/* 페이지당 보기 + 페이지네이션 */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                {/* 페이지당 보기 */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">페이지당 표시:</span>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                        <option value="5">5개</option>
                        <option value="10">10개</option>
                        <option value="20">20개</option>
                    </select>
                </div>

                {/* 페이지 번호 */}
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
            {showVideoModal && selectedUser && (
                <VideoDetailModal
                    onClose={() => setShowVideoModal(false)}
                    userName={selectedUser.name}
                    videos={watchedVideos}
                />
            )}

            {showQuizModal && selectedUser && (
                <QuizDetailModal
                    onClose={() => setShowQuizModal(false)}
                    userName={selectedUser.name}
                    quizzes={submittedQuizzes}
                />
            )}
        </div>
    );
};

export default AttendanceSection;