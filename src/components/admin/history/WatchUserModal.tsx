import React, { useEffect, useState } from "react";
import { X, Users } from "lucide-react";
import { fetchAdminOrgSingleVideoWatch } from "@/api/adminStats/view";
import type { AdminWatchedMember } from "@/types/video";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface WatchUserModalProps {
  videoId: number;
  video: {
    title: string;
  };
  onClose: () => void;
}

const WatchUserModal: React.FC<WatchUserModalProps> = ({
  videoId,
  video,
  onClose,
}) => {
  const { orgId } = useAuth();
  const [users, setUsers] = useState<AdminWatchedMember[]>([]);
  const [loading, setLoading] = useState(true);

  /** 시청자 목록 API 호출 */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminOrgSingleVideoWatch(orgId || 0, videoId);
        setUsers(data);
      } catch (e) {
        console.error("❌ 시청자 목록 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId, videoId]);

  const formatDateWithoutSeconds = (dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            {video.title} - 시청자 목록
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <LoadingSpinner text="로딩 중..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr className="text-gray-700">
                    <th className="px-4 py-3 text-left font-semibold">NO</th>
                    <th className="px-4 py-3 text-left font-semibold">닉네임</th>
                    <th className="px-4 py-3 text-left font-semibold">그룹</th>
                    <th className="px-4 py-3 text-left font-semibold">시청률</th>
                    <th className="px-4 py-3 text-left font-semibold">최근 시청일</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={i}
                      className={`border-b last:border-b-0 ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{u.nickname}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex flex-wrap gap-3">
                          {u.groups.map((g, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-full text-xs bg-gray-100 border"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">{u.watch_rate}%</td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.watched_at
                            ? formatDateWithoutSeconds(u.watched_at)
                            : "-"}
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
            className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatchUserModal;