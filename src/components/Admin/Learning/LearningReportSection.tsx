import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, UserCircle } from "lucide-react";

interface LearningData {
  date: string;
  views: number;
}

interface UserReport {
  userId: string;
  userName: string;
  group: string;
  totalViews: number;
  topTags: string[];
  data: LearningData[];
}

const userReports: UserReport[] = [
  {
    userId: "001",
    userName: "김철수",
    group: "HR팀, IT팀",
    totalViews: 56,
    topTags: ["AI", "보안", "교육"],
    data: [
      { date: "1월", views: 10, },
      { date: "2월", views: 14, },
      { date: "3월", views: 22, },
    ],
  },
  {
    userId: "002",
    userName: "박민지",
    group: "IT팀",
    totalViews: 34,
    topTags: ["AI", "윤리", "프라이버시"],
    data: [
      { date: "1월", views: 8, },
      { date: "2월", views: 10, },
      { date: "3월", views: 12, },
    ],
  },
  {
    userId: "003",
    userName: "이수현",
    group: "R&D팀",
    totalViews: 40,
    topTags: ["AI", "신입교육", "보안"],
    data: [
      { date: "1월", views: 9, },
      { date: "2월", views: 12, },
      { date: "3월", views: 10, },
    ],
  },
];
interface LearningReportSectionProps {
  initialUserId?: string;
}

const LearningReportSection: React.FC<LearningReportSectionProps> = ({ initialUserId }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || "001");

  const [query, setQuery] = useState("");

  const selectedUser = userReports.find((u) => u.userId === selectedUserId);

  // 검색 필터링
  const filteredUsers = useMemo(() => {
    return userReports.filter(
      (u) => u.userName.includes(query) || u.userId.includes(query)
    );
  }, [query]);

  return (
    <div>
      {/* 상단 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        {/* 검색창 */}
        <div className="relative w-full max-w-sm">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="닉네임으로 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          {/* 검색 결과 드롭다운 */}
          {query && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-md w-full mt-1 max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li
                    key={user.userId}
                    onClick={() => {
                      setSelectedUserId(user.userId);
                      setQuery("");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  >
                    {user.userName} ({user.userId}) — {user.group}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 text-sm">
                  검색 결과 없음
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* 선택된 사용자 정보 */}
      {selectedUser ? (
        <>
          {/* 헤더 카드 섹션 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* 사용자 프로필 카드 */}
            <div className="flex justify-center items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-4">
              <div className="flex items-center">
                {/* 아이콘 */}
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-6">
                  <UserCircle size={35} className="text-blue-500" />
                </div>

                {/* 사용자 정보 */}
                <div className="flex flex-col text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                    {selectedUser.userName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    그룹: {selectedUser.group}
                  </p>
                </div>
              </div>
            </div>

            {/* 총 시청 수 */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-4">
              <p className="text-xs text-gray-500 mb-1">시청 완료한 총 영상 수</p>
              <p className="text-xl font-bold text-blue-600">
                {selectedUser.totalViews} <span className="text-xs text-gray-400 mt-0.5">개</span>
              </p>

            </div>

            {/* 가장 많이 본 카테고리 */}
            <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-4">
              <p className="text-xs text-gray-500 mb-1">가장 많이 본 카테고리</p>
              <div className="flex flex-wrap justify-center gap-1">
                {selectedUser.topTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-sm font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 학습 트렌드 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
            <h3 className="text-base font-semibold text-gray-700 mb-3">
              월별 시청 활동 추이
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={selectedUser.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  name="시청한 영상 수"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-12">
          사용자를 선택하거나 검색해주세요.
        </div>
      )}
    </div>
  );
};

export default LearningReportSection;