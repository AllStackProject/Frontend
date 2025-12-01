import React, { useEffect, useState } from "react";
import {
  X,
  LineChart,
  TrendingDown,
  TrendingUp,
  Info,
  Award,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { fetchIntervalDetail } from "@/api/adminStats/report";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Props {
  video: {
    id: number;
    title: string;
  };
  onClose: () => void;
}

interface SegmentData {
  time: number; // 초 (seg_idx * 10)
  viewRate: number; // watch_rate
  dropOff: number; // quit_rate
}

// 초 → 분:초 포맷 변환
const formatTimeToMinutes = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// 툴팁
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {formatTimeToMinutes(label)} ~ {formatTimeToMinutes(label + 10)}
        </p>

        {payload.map((entry: any, idx: number) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-semibold">{entry.value.toFixed(1)}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const VideoAnalyticsModal: React.FC<Props> = ({ video, onClose }) => {
  const orgId = Number(localStorage.getItem("org_id"));
  const [data, setData] = useState<SegmentData[]>([]);
  const [loading, setLoading] = useState(true);

  /** API 데이터 로드 */
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await fetchIntervalDetail(orgId, video.id);

        const transformed = raw.map((item: any) => ({
          time: item.seg_idx * 10,
          viewRate: item.watch_rate,
          dropOff: item.quit_rate,
        }));

        setData(transformed);
      } catch (err) {
        console.error("❌ 구간 상세 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId, video.id]);

  if (loading) <LoadingSpinner text="불러오는 중..." />;

  /** 통계 계산 */
  const avgViewRate =
    data.reduce((sum, d) => sum + d.viewRate, 0) / data.length || 0;

  const avgDropOff =
    data.reduce((sum, d) => sum + d.dropOff, 0) / data.length || 0;

  const top3Watched = [...data]
    .filter((d) => d.time >= 10) // 0-10초 구간 제외 룰 유지
    .sort((a, b) => b.viewRate - a.viewRate)
    .slice(0, 3);

  const highDrop = data.reduce((max, cur) =>
    cur.dropOff > max.dropOff ? cur : max
  );

  /** 모달 외부 클릭 → 닫기 */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
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
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
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
          >
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-blue-600" />
                <p className="text-sm font-medium text-blue-900">평균 시청률</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {avgViewRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-red-600" />
                <p className="text-sm font-medium text-red-900">평균 이탈률</p>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {avgDropOff.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Top 3 구간 */}
          {top3Watched.length > 0 && (
            <div className="bg-yellow-50 border border-amber-200 rounded-lg p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-amber-600" />
                <h3 className="text-base font-semibold text-amber-900">
                  최고 시청 구간 Top 3
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {top3Watched.map((seg, idx) => (
                  <div
                    key={seg.time}
                    className="bg-white border border-amber-300 rounded-lg p-4 relative"
                  >
                    {/* 순위 배지 */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : idx === 1
                            ? "bg-gray-300 text-gray-700"
                            : "bg-orange-300 text-orange-900"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-1">구간</p>
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {formatTimeToMinutes(seg.time)}~
                      {formatTimeToMinutes(seg.time + 10)}
                    </p>

                    <p className="text-2xl font-bold text-amber-600">
                      {seg.viewRate.toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 시청률 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-blue-600" />
              구간별 시청률
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="viewRate"
                  name="시청률"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          {/* 이탈률 차트 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <TrendingDown size={18} className="text-red-600" />
              구간별 이탈률
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <ReLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="dropOff"
                  name="이탈률"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>

          {/* 분석 인사이트 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="text-blue-600" />

              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  분석 인사이트
                </h4>

                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    가장 높은 시청률 구간:{" "}
                    <strong>
                      {formatTimeToMinutes(top3Watched[0]?.time)} ~{" "}
                      {formatTimeToMinutes(top3Watched[0]?.time + 10)}
                    </strong>
                  </li>

                  <li>
                    이탈률이 가장 높은 구간:{" "}
                    <strong>
                      {formatTimeToMinutes(highDrop.time)} ~{" "}
                      {formatTimeToMinutes(highDrop.time + 10)}
                    </strong>
                  </li>

                  <li>
                    평균 시청률: <strong>{avgViewRate.toFixed(1)}%</strong>,
                    평균 이탈률: <strong>{avgDropOff.toFixed(1)}%</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors text-sm font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyticsModal;