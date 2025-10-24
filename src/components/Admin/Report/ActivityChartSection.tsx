import React from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "4월", views: 300, quizzes: 170 },
  { month: "5월", views: 270, quizzes: 150 },
  { month: "6월", views: 350, quizzes: 210 },
];

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {payload[0].payload.month}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-800">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ActivityChartSection: React.FC = () => {
  // 총계 계산
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  const totalQuizzes = data.reduce((sum, item) => sum + item.quizzes, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">월별 학습 활동 추이</h3>
          </div>
          <p className="text-sm text-gray-600">
            최근 3개월간의 시청 및 퀴즈 완료 현황
          </p>
        </div>

        {/* 총계 요약 */}
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">총 시청 수</p>
            <p className="text-lg font-bold text-blue-600">
              {totalViews.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 mb-1">총 퀴즈 완료</p>
            <p className="text-lg font-bold text-green-600">
              {totalQuizzes.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
            }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorViews)"
            name="시청 수"
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="quizzes"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorQuizzes)"
            name="퀴즈 완료 수"
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* 하단 인사이트 */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-900 mb-0.5">시청 추세</p>
            <p className="text-xs text-blue-700">
              6월에 가장 높은 시청 수를 기록했습니다.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-green-900 mb-0.5">퀴즈 참여율</p>
            <p className="text-xs text-green-700">
              전반적으로 퀴즈 완료 수가 증가하는 추세입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChartSection;