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
import { Search, Info, UserCircle } from "lucide-react";

interface LearningData {
  date: string;
  views: number;
  quizzes: number;
}

interface UserReport {
  userId: string;
  userName: string;
  group: string;
  totalViews: number;
  totalQuizzes: number;
  topTags: string[];
  data: LearningData[];
}

const userReports: UserReport[] = [
  {
    userId: "001",
    userName: "김철수",
    group: "HR팀",
    totalViews: 56,
    totalQuizzes: 42,
    topTags: ["AI", "보안", "교육"],
    data: [
      { date: "1월", views: 10, quizzes: 5 },
      { date: "2월", views: 14, quizzes: 9 },
      { date: "3월", views: 22, quizzes: 15 },
      { date: "4월", views: 28, quizzes: 20 },
    ],
  },
  {
    userId: "002",
    userName: "박민지",
    group: "IT팀",
    totalViews: 34,
    totalQuizzes: 20,
    topTags: ["AI", "윤리", "프라이버시"],
    data: [
      { date: "1월", views: 8, quizzes: 4 },
      { date: "2월", views: 10, quizzes: 5 },
      { date: "3월", views: 12, quizzes: 6 },
      { date: "4월", views: 14, quizzes: 8 },
    ],
  },
  {
    userId: "003",
    userName: "이수현",
    group: "R&D팀",
    totalViews: 40,
    totalQuizzes: 35,
    topTags: ["AI", "신입교육", "보안"],
    data: [
      { date: "1월", views: 9, quizzes: 8 },
      { date: "2월", views: 12, quizzes: 9 },
      { date: "3월", views: 10, quizzes: 11 },
      { date: "4월", views: 9, quizzes: 7 },
    ],
  },
];
interface LearningReportSectionProps {
  initialUserId?: string;
}

const LearningReportSection: React.FC<LearningReportSectionProps> = ({ initialUserId }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId || "001");

  const [query, setQuery] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

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
              placeholder="이름 또는 ID로 검색"
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
          {/* ✅ 사용자 정보 헤더 */}
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
              <UserCircle size={36} className="text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedUser.userName}{" "}
                <span className="text-sm text-gray-500">
                  ({selectedUser.userId})
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                그룹: {selectedUser.group}
              </p>
            </div>
          </div>

          {/* 리포트 요약 */}
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">총 시청한 영상 수</p>
              <p className="text-2xl font-bold text-blue-500 mt-1">
                {selectedUser.totalViews}개
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">총 완료한 퀴즈 수</p>
              <p className="text-2xl font-bold text-green-500 mt-1">
                {selectedUser.totalQuizzes}개
              </p>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-sm text-gray-500">가장 많이 본 해시태그</p>
              <p className="text-lg font-semibold mt-1 text-gray-800">
                {selectedUser.topTags.map((tag) => `#${tag} `)}
              </p>
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
                <Line
                  type="monotone"
                  dataKey="quizzes"
                  stroke="#10b981"
                  name="완료한 퀴즈 수"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 상세 기록 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                월별 시청 상세 기록
              </h3>

              {/* 활동지수 설명 */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info size={16} className="text-gray-500 cursor-pointer" />
                {showTooltip && (
                  <div className="absolute right-0 top-6 bg-gray-800 text-white text-xs rounded-md px-3 py-2 shadow-md w-64">
                    <p>
                      <strong>활동지수</strong>는 사용자의 시청 참여도를 나타내는
                      지표입니다.
                    </p>
                    <p className="mt-1 text-gray-300">
                      계산식: (시청한 영상 수 + 완료한 퀴즈 수) ÷ 2
                    </p>
                  </div>
                )}
              </div>
            </div>

            <table className="w-full text-sm border border-gray-100">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600 text-left">
                  <th className="p-3">월</th>
                  <th className="p-3">시청한 영상 수</th>
                  <th className="p-3">완료한 퀴즈 수</th>
                  <th className="p-3">활동지수</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.data.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50 transition text-gray-700"
                  >
                    <td className="p-3 font-medium">{item.date}</td>
                    <td className="p-3">{item.views}</td>
                    <td className="p-3">{item.quizzes}</td>
                    <td className="p-3 font-semibold text-blue-600">
                      {Math.round((item.views + item.quizzes) / 2)}점
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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