import React from "react";
import { X, LineChart, TrendingDown, TrendingUp, Info, Award } from "lucide-react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface Props {
  video: {
    id: string;
    title: string;
    duration: number;
  };
  onClose: () => void;
}

// 가짜 구간별 시청률 & 이탈률 데이터
const generateDummyData = (duration: number) => {
  const interval = 10;
  const segments = Math.ceil(duration / interval);
  return Array.from({ length: segments }, (_, i) => ({
    time: i * 10, // 숫자로 변경
    timeLabel: `${i * 10}~${(i + 1) * 10}s`,
    viewRate: Math.max(0, 100 - i * (Math.random() * 10)), // 구간별 시청률
    dropOff: Math.min(100, i * (Math.random() * 5)), // 구간별 이탈률
  }));
};

// 초를 분:초 형식으로 변환
const formatTimeToMinutes = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {formatTimeToMinutes(label)}~{formatTimeToMinutes(label + 10)}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value.toFixed(1)}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VideoAnalyticsModal: React.FC<Props> = ({ video, onClose }) => {
  const data = generateDummyData(video.duration);

  // 0~10초 구간 제외하고 가장 많이 시청된 구간 Top 3
  const dataExcludingFirst = data.slice(1); // 첫 구간 제외
  const top3Watched = [...dataExcludingFirst]
    .sort((a, b) => b.viewRate - a.viewRate)
    .slice(0, 3);

  // 이탈률 높은 구간
  const highDrop = data.reduce((max, cur) => (cur.dropOff > max.dropOff ? cur : max), data[0]);
  
  // 평균 시청률
  const avgViewRate = (data.reduce((sum, cur) => sum + cur.viewRate, 0) / data.length).toFixed(1);
  
  // 평균 이탈률
  const avgDropOff = (data.reduce((sum, cur) => sum + cur.dropOff, 0) / data.length).toFixed(1);

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
              <LineChart size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">구간별 시청 분석</h2>
              <p className="text-sm text-gray-600">{video.title}</p>
            </div>
          </div>
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
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-blue-600" />
                <p className="text-sm font-medium text-blue-900">평균 시청률</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{avgViewRate}%</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-red-600" />
                <p className="text-sm font-medium text-red-900">평균 이탈률</p>
              </div>
              <p className="text-2xl font-bold text-red-700">{avgDropOff}%</p>
            </div>
          </div>

          {/* Top 3 최고 시청 구간 */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-amber-600" />
              <h3 className="text-base font-semibold text-amber-900">최고 시청 구간 Top 3</h3>
              <span className="text-xs text-amber-600">(0~10초 구간 제외)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {top3Watched.map((segment, index) => (
                <div 
                  key={segment.time}
                  className="bg-white border-2 border-amber-200 rounded-lg p-4 relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      'bg-orange-300 text-orange-900'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">구간</p>
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    {formatTimeToMinutes(segment.time)}~{formatTimeToMinutes(segment.time + 10)}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-amber-600">
                      {segment.viewRate.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 시청률 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-600" /> 
                구간별 시청률
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info size={14} />
                <span>10초 단위</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: '시간 (초)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: '(%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="viewRate" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="시청률"
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          {/* 이탈률 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <TrendingDown size={18} className="text-red-600" /> 
                구간별 이탈률
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info size={14} />
                <span>10초 단위</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: '시간 (초)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  label={{ value: '(%)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="dropOff" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="이탈률"
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          {/* 인사이트 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">분석 인사이트</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>
                      <span className="font-semibold">
                        {formatTimeToMinutes(top3Watched[0].time)}~{formatTimeToMinutes(top3Watched[0].time + 10)}
                      </span> 구간이 가장 높은 시청률({top3Watched[0].viewRate.toFixed(1)}%)을 보였습니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>
                      <span className="font-semibold">
                        {formatTimeToMinutes(highDrop.time)}~{formatTimeToMinutes(highDrop.time + 10)}
                      </span> 구간에서 이탈률({highDrop.dropOff.toFixed(1)}%)이 높아 콘텐츠 개선이 필요할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>
                      전체 평균 시청률은 <span className="font-semibold">{avgViewRate}%</span>이며, 이탈률은 <span className="font-semibold">{avgDropOff}%</span>입니다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
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

export default VideoAnalyticsModal;