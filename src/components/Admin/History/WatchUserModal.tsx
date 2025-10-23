import React from "react";
import { X, Users } from "lucide-react";

interface WatchUserModalProps {
  video: {
    title: string;
  };
  onClose: () => void;
}

const dummyWatchers = [
  { id: "001", name: "김철수", group: "HR팀", rate: 100, date: "2025-02-05" },
  { id: "002", name: "박민지", group: "IT팀", rate: 80, date: "2025-02-06" },
  { id: "003", name: "이수현", group: "R&D팀", rate: 60, date: "2025-02-07" },
  { id: "004", name: "정우성", group: "기획팀", rate: 95, date: "2025-02-08" },
  { id: "005", name: "최지훈", group: "HR팀", rate: 75, date: "2025-02-09" },
];

const WatchUserModal: React.FC<WatchUserModalProps> = ({ video, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            {video.title} - 시청자 목록
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr className="text-gray-700">
                  <th className="px-4 py-3 text-left font-semibold">유저 ID</th>
                  <th className="px-4 py-3 text-left font-semibold">이름</th>
                  <th className="px-4 py-3 text-left font-semibold">그룹</th>
                  <th className="px-4 py-3 text-left font-semibold">시청률</th>
                  <th className="px-4 py-3 text-left font-semibold">시청일</th>
                </tr>
              </thead>
              <tbody>
                {dummyWatchers.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-600">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.group}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              u.rate >= 80
                                ? "bg-green-500"
                                : u.rate >= 50
                                ? "bg-blue-500"
                                : "bg-red-400"
                            }`}
                            style={{ width: `${u.rate}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            u.rate >= 80
                              ? "text-green-600"
                              : u.rate >= 50
                              ? "text-blue-600"
                              : "text-red-500"
                          }`}
                        >
                          {u.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default WatchUserModal;