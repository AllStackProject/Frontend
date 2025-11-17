import React from "react";
import { X, ExternalLink, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WatchedVideo {
    id: string;
    title: string;
    watchRate: number;
    watchDate: string;
}

interface VideoDetailModalProps {
    onClose: () => void;
    userName: string;
    videos: WatchedVideo[];
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
    onClose,
    userName,
    videos,
}) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* 헤더 */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Video size={20} className="text-blue-600" />
                        {userName}님의 시청한 동영상 목록
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="닫기"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* 내용 */}
                <div className="p-6 overflow-y-auto flex-1">
                    {videos.length === 0 ? (
                        <p className="text-gray-500 text-center py-12">
                            시청한 동영상이 없습니다.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-700">
                                        <th className="px-4 py-3 text-left font-semibold">제목</th>
                                        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">시청률</th>
                                        <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">최근 시청일</th>
                                        <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">동영상</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {videos.map((v, index) => (
                                        <tr
                                            key={v.id}
                                            className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {v.title}
                                            </td>
                                            <td className="px-4 py-3 text-blue-600 font-semibold whitespace-nowrap">
                                                {v.watchRate}%
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                                {v.watchDate}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => navigate(`/video/${v.id}`)}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                                >
                                                    <ExternalLink size={14} />
                                                    보기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 하단 */}
                <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoDetailModal;