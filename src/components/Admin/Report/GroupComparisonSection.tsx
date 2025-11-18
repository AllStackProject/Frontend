import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, Info } from "lucide-react";
import { fetchGroupWatchRate } from "@/api/admin/report";
import ReportFilterBar from "@/components/admin/report/ReportFilterBar";

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {payload[0].payload.name}
        </p>
        <p className="text-sm text-gray-600">
          완료율:{" "}
          <span className="font-bold text-blue-600">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const GroupComparisonSection: React.FC = () => {
  const orgId = Number(localStorage.getItem("org_id"));

  // 현재 달을 YYYY-MM 형태로 가져오는 함수
  const getCurrentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // 필터 선택 월 (초기: 이번 달)
  const [month, setMonth] = useState(getCurrentMonth());

  // API 데이터
  const [data, setData] = useState<{ name: string; completion: number }[]>([]);
  const [avgCompletion, setAvgCompletion] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);

  /** API 호출 */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchGroupWatchRate(orgId, month);

        setAvgCompletion(res.avg_complete_rate);

        const mapped = res.group_watch_complete_rates.map((g) => ({
          name: g.name,
          completion: g.avg_group_complete_rate,
        }));

        setData(mapped);
      } catch (e) {
        console.error("❌ 그룹별 완료율 조회 실패:", e);
      }
    };

    load();
  }, [orgId, month]); // month 변경될 때마다 자동 re-fetch

  // -----------------------------
  // 최고 / 최저 시청 완료율 계산
  // -----------------------------
  const maxCompletion = useMemo(
    () => Math.max(...data.map((g) => g.completion), 0),
    [data]
  );
  const minCompletion = useMemo(
    () => Math.min(...data.map((g) => g.completion), 100),
    [data]
  );

  const topGroup = data.find((g) => g.completion === maxCompletion);
  const lowGroup = data.find((g) => g.completion === minCompletion);

  // ======================
  // 렌더
  // ======================
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

      {/* ⭐ 필터바 */}
      <div className="mb-4">
        <ReportFilterBar selectedMonth={month} onChangeMonth={setMonth} />
      </div>

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">
              그룹별 시청 완료율 비교
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            각 그룹의 평균 시청 완료율을 비교합니다.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
            <Info size={16} className="text-gray-600" />
          </div>

          {showTooltip && (
            <div className="absolute right-0 top-10 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 z-10">
              <p className="font-semibold mb-1">완료율 계산 방식</p>
              <p className="text-gray-300">
                모든 멤버의 시청 완료율 평균값입니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-blue-600 mb-1">조직 평균 완료율</p>
          <p className="text-xl font-bold text-blue-600">{avgCompletion}%</p>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-xs text-green-600 mb-1">최고 그룹</p>
          <p className="text-sm font-bold text-green-600">{topGroup?.name}</p>
          <p className="text-xs text-green-700 mt-0.5">{topGroup?.completion}%</p>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <p className="text-xs text-amber-600 mb-1">개선 필요</p>
          <p className="text-sm font-bold text-amber-600">{lowGroup?.name}</p>
          <p className="text-xs text-amber-700 mt-0.5">{lowGroup?.completion}%</p>
        </div>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.completion === maxCompletion
                    ? "#10b981" // 최고
                    : entry.completion === minCompletion
                    ? "#f59e0b" // 최저
                    : "#3b82f6" // 기본
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupComparisonSection;