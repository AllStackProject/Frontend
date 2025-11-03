import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Clock, Calendar } from "lucide-react";

const dayData = [
  { day: "월", views: 150 },
  { day: "화", views: 200 },
  { day: "수", views: 250 },
  { day: "목", views: 220 },
  { day: "금", views: 310 },
  { day: "토", views: 80 },
  { day: "일", views: 50 },
];

const timeData = [
  { time: "06-09시", views: 40 },
  { time: "09-12시", views: 200 },
  { time: "12-15시", views: 280 },
  { time: "15-18시", views: 340 },
  { time: "18-21시", views: 410 },
  { time: "21-24시", views: 230 },
  { time: "00-06시", views: 50 },
];

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {payload[0].payload.day || payload[0].payload.time}
        </p>
        <p className="text-sm text-gray-600">
          시청 완료: <span className="font-bold text-gray-800">{payload[0].value}</span>회
        </p>
      </div>
    );
  }
  return null;
};

const TimePatternSection: React.FC = () => {
  // 최고 시청 요일 및 시간대 찾기
  const maxDayViews = Math.max(...dayData.map(d => d.views));
  const maxTimeViews = Math.max(...timeData.map(t => t.views));
  const peakDay = dayData.find(d => d.views === maxDayViews);
  const peakTime = timeData.find(t => t.views === maxTimeViews);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={20} className="text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">시청 완료 패턴</h3>
        </div>
        <p className="text-sm text-gray-600">
          요일별, 시간대별 사용자 활동 패턴 분석
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 요일별 시청 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-700">요일별 시청 완료 수</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
              <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                {dayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.views === maxDayViews ? "#3b82f6" : "#93c5fd"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">{peakDay?.day}요일</span>에 가장 높은 시청 완료율을 기록했습니다.
            </p>
          </div>
        </div>

        {/* 시간대별 시청 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-green-600" />
            <p className="text-sm font-semibold text-gray-700">시간대별 시청 완료 수</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={{ stroke: "#d1d5db" }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.1)" }} />
              <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                {timeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.views === maxTimeViews ? "#10b981" : "#6ee7b7"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              <span className="font-semibold">{peakTime?.time}</span>에 가장 활발한 학습 활동이 이루어집니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePatternSection;