import React, { useState, useMemo, useEffect } from "react";
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
import {
  fetchAdminMemberReport,
} from "@/api/admin/viewVideo";
import { getOrgMembers } from "@/api/admin/members";
import type { OrgMember } from "@/types/member";
import { useAuth } from "@/context/AuthContext";

interface LearningReportSectionProps {
  initialUserId?: number;
}

const LearningReportSection: React.FC<LearningReportSectionProps> = ({ initialUserId }) => {
  const { orgId } = useAuth();

  /** 전체 멤버 (그룹, 닉네임만) */
  const [members, setMembers] = useState<OrgMember[]>([]);

  /** 선택된 멤버 */
  const [selectedUserId, setSelectedUserId] = useState<number | null>(initialUserId ?? null);

  /** 검색 */
  const [query, setQuery] = useState("");

  /** 멤버 리포트 데이터 */
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ===========================
  // 1) 전체 멤버 조회
  // ===========================
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const memberList = await getOrgMembers(orgId || 0);
        setMembers(memberList);

        // 초기에 선택된 userId가 없다면 첫 번째 멤버 자동 선택
        if (!initialUserId && memberList.length > 0) {
          setSelectedUserId(memberList[0].id);
        }
      } catch (err) {
        console.error("❌ 전체 멤버 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [orgId]);

  // ===========================
  // 2) 특정 멤버 리포트 조회
  // ===========================
  useEffect(() => {
    if (!selectedUserId) return;

    const loadReport = async () => {
      try {
        const r = await fetchAdminMemberReport(orgId || 0, selectedUserId);
        setReport(r);
      } catch (err) {
        console.error("❌ 리포트 조회 실패:", err);
      }
    };

    loadReport();
  }, [selectedUserId, orgId]);

  // ===========================
  // 3) 검색 필터링
  // ===========================
  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.nickname.includes(query)
    );
  }, [query, members]);

  const selectedMember = members.find((m) => m.id === selectedUserId);

  // 월별 그래프 변환
  const chartData =
    report?.monthly_watched_cnts?.map((m: any) => ({
      date: `${m.year}-${m.month}`,
      views: m.watched_video_cnt,
    })) ?? [];

  if (loading)
    return <div className="text-center text-gray-500 py-12">불러오는 중...</div>;

  return (
    <div>
      {/* 검색창 */}
      <div className="relative w-full max-w-sm mb-6">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="닉네임 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>

        {query && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow w-full mt-1 max-h-48 overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <li
                  key={m.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedUserId(m.id);
                    setQuery("");
                  }}
                >
                  {m.nickname}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400 text-sm">검색 결과 없음</li>
            )}
          </ul>
        )}
      </div>

      {/* 선택된 멤버 정보 */}
      {selectedMember && report ? (
        <>
          {/* 카드 전체 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            {/* 프로필 */}
            <div className="bg-white border rounded-lg p-4 flex items-center shadow-sm">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                <UserCircle size={30} className="text-blue-500" />
              </div>
              <div>
                <p className="font-semibold">{selectedMember.nickname}</p>

                {/* 그룹 뱃지 */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMember.member_groups.map((g, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 text-[10px] rounded-full bg-gray-100 border"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 시청 완료 영상 수 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-gray-500 mb-1">시청 완료한 총 영상 수</p>
              <p className="text-xl font-bold text-blue-600">
                {report.total_watched_video_cnt}
                <span className="text-xs text-gray-400 ml-1">개</span>
              </p>
            </div>

            {/* 가장 많이 본 카테고리 */}
            <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col items-center justify-center text-center">
              <p className="text-xs text-gray-500 mb-2">가장 많이 본 카테고리</p>

              <div className="flex flex-wrap justify-center gap-1">
                {report.most_watched_categories.length > 0 ? (
                  report.most_watched_categories.map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">데이터 없음</span>
                )}
              </div>
            </div>
          </div>

          {/* 월별 그래프 */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-3">월별 시청 활동 추이</h3>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-10">기록 없음</div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">멤버를 선택해주세요.</div>
      )}
    </div>
  );
};

export default LearningReportSection;