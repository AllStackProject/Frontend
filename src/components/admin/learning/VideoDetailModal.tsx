import React, { useEffect, useState } from "react";
import { X, ExternalLink, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAdminMemberWatchDetail } from "@/api/adminStats/view";
import type { MemberWatchDetail } from "@/types/video";

interface VideoDetailModalProps {
  onClose: () => void;
  userName: string;
  userId: number;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  onClose,
  userName,
  userId,
}) => {
  const navigate = useNavigate();
  const orgId = Number(localStorage.getItem("org_id"));

  const [videos, setVideos] = useState<MemberWatchDetail[]>([]);
  const [loading, setLoading] = useState(true);

  /** API 호출 */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminMemberWatchDetail(orgId, userId);
        setVideos(
          data.map((v) => ({
            ...v,
            watchRate: v.watch_rate,
            watchDate: v.watched_at,
          }))
        );
      } catch (err) {
        console.error("❌ 상세 시청 기록 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orgId, userId]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Video size={20} className="text-blue-600" />
            {userName}님의 시청 영상
          </h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-10 text-gray-500">불러오는 중...</div>
          ) : videos.length === 0 ? (
            <p className="text-center py-10 text-gray-500">시청 기록 없음</p>
          ) : (
            <table className="w-full text-sm border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">제목</th>
                  <th className="px-4 py-3 text-left">시청률</th>
                  <th className="px-4 py-3 text-left">최근 시청일</th>
                  <th className="px-4 py-3 text-center">동영상</th>
                </tr>
              </thead>

              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{v.title}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">
                      {v.watch_rate}%
                    </td>
                    <td className="px-4 py-3">
                    {v.watched_at
                          ? new Date(v.watched_at).toLocaleString()
                          : "-"}
                          </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigate(`/video/${v.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={14} className="inline mr-1" />
                        보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 하단 */}
        <div className="p-4 border-t text-right bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailModal;