import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Info, TrendingUp } from "lucide-react";

const groupData = [
  { name: "HR팀", completion: 82, members: 15 },
  { name: "IT팀", completion: 75, members: 28 },
  { name: "R&D팀", completion: 68, members: 22 },
  { name: "기획팀", completion: 90, members: 18 },
];

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {payload[0].payload.name}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            완료율: <span className="font-bold text-blue-600">{payload[0].value}%</span>
          </p>
          <p className="text-xs text-gray-500">
            멤버수: {payload[0].payload.members}명
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const GroupComparisonSection: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // 최고/최저 완료율 그룹 찾기
  const maxCompletion = Math.max(...groupData.map(g => g.completion));
  const minCompletion = Math.min(...groupData.map(g => g.completion));
  const topGroup = groupData.find(g => g.completion === maxCompletion);
  const lowGroup = groupData.find(g => g.completion === minCompletion);
  const avgCompletion = Math.round(groupData.reduce((sum, g) => sum + g.completion, 0) / groupData.length);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">그룹별 시청 완료율 비교</h3>
          </div>
          <p className="text-sm text-gray-600">
            각 그룹의 평균 시청 완료율을 비교합니다.
          </p>
        </div>

        {/* 정보 툴팁 */}
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
              <p className="text-gray-300">완료 시청자 ÷ 전체 시청자 × 100</p>
            </div>
          )}
        </div>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-xs text-blue-600 mb-1">조직 평균 완료율</p>
          <p className="text-2xl font-bold text-blue-600">{avgCompletion}%</p>
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
        <BarChart data={groupData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: '완료율 (%)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
          <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
            {groupData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.completion === maxCompletion 
                    ? "#10b981" 
                    : entry.completion === minCompletion 
                    ? "#f59e0b" 
                    : "#3b82f6"
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* 하단 인사이트 */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <TrendingUp size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-green-900 mb-0.5">우수 그룹</p>
            <p className="text-xs text-green-700">
              {topGroup?.name}은 {topGroup?.completion}%의 높은 완료율을 기록했습니다.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-900 mb-0.5">개선 제안</p>
            <p className="text-xs text-amber-700">
              {lowGroup?.name}의 시청 참여를 독려하기 위한 별도 지원이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupComparisonSection;