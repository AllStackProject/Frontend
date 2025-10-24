import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { UserCircle, Users } from "lucide-react";

const genderData = [
  { name: "남성", value: 68, count: 87 },
  { name: "여성", value: 32, count: 41 },
];

const ageData = [
  { range: "20대", count: 45, percentage: 35 },
  { range: "30대", count: 60, percentage: 47 },
  { range: "40대", count: 30, percentage: 23 },
  { range: "50대+", count: 15, percentage: 12 },
];

const GENDER_COLORS = ["#3b82f6", "#ec4899"];

// 커스텀 파이 차트 레이블
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600">
          인원: <span className="font-bold text-gray-800">{payload[0].value}명</span>
        </p>
        {payload[0].payload.percentage && (
          <p className="text-xs text-gray-500 mt-1">
            비율: {payload[0].payload.percentage}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const DemographicSection: React.FC = () => {
  const totalMembers = genderData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UserCircle size={20} className="text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">조직 멤버 통계</h3>
        </div>
        <p className="text-sm text-gray-600">
          조직 멤버의 성별 및 연령대 분포를 확인합니다.
        </p>
      </div>

      {/* 총 인원 */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
        <p className="text-sm text-purple-600 mb-1">총 멤버 수</p>
        <p className="text-xl font-bold text-purple-600">{totalMembers}명</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 성별 분포 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100">
              <Users size={18} className="text-pink-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">성별 분포</p>
          </div>
          
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={renderCustomLabel}
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* 범례 */}
          <div className="flex justify-center gap-6 mt-3">
            {genderData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: GENDER_COLORS[i] }}
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-600 ml-1">
                    {item.count}명 ({item.value}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 연령대 분포 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
              <UserCircle size={18} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">연령대 분포</p>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(147, 51, 234, 0.1)" }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {ageData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      index === 0 ? "#3b82f6" :
                      index === 1 ? "#8b5cf6" :
                      index === 2 ? "#ec4899" :
                      "#f97316"
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* 통계 요약 */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ageData.map((item, i) => (
              <div key={i} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">{item.range}</p>
                <p className="text-sm font-bold text-gray-800">{item.count}명</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 인사이트 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-2">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-200">
              <span className="text-blue-700 text-xs font-bold">i</span>
            </div>
          </div>
          <div className="text-xs text-blue-800">
            <p className="font-semibold mb-1">조직 통계 분석</p>
            <p className="text-blue-700">
              30대 멤버가 가장 많으며({ageData[1].count}명, {ageData[1].percentage}%), 
              성별 비율은 남성 {genderData[0].value}%, 여성 {genderData[1].value}%로 나타났습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicSection;