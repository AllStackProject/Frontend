import React, { useEffect, useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Clock, Calendar } from "lucide-react";
import { fetchHourlyReport, fetchDayReport } from "@/api/adminStats/report";
import ReportFilterBar from "@/components/admin/report/ReportFilterBar";

interface DayData {
  day: string;
  views: number;
}

interface TimeData {
  time: string;
  views: number;
}

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {payload[0].payload.day || payload[0].payload.time}
        </p>
        <p className="text-sm text-gray-600">
          시청 완료:{" "}
          <span className="font-bold text-gray-800">{payload[0].value}</span>회
        </p>
      </div>
    );
  }
  return null;
};

const TimePatternSection: React.FC = () => {
  const orgId = Number(localStorage.getItem("org_id"));


  const [dayData, setDayData] = useState<DayData[]>([]);
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [loading, setLoading] = useState(true);
  // 현재 달 자동 설정
  const getCurrentMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());


  const handleMonthChange = (m: string) => {
    setMonth(m);
  };

  /** 요일명 / 시간대 라벨 */
  const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
  const TIME_LABELS = [
    "00-03시",
    "03-06시",
    "06-09시",
    "09-12시",
    "12-15시",
    "15-18시",
    "18-21시",
    "21-24시",
  ];

  /**  API 호출 */
  useEffect(() => {
    const load = async () => {
      try {
        const dayRes = await fetchDayReport(orgId, month);
        const hourRes = await fetchHourlyReport(orgId, month);

        // 요일 데이터 변환
        const mappedDay = dayRes.day_watch_cnts.map((v, idx) => ({
          day: DAY_LABELS[idx],
          views: v,
        }));

        // 시간대 데이터 변환
        const mappedHour = hourRes.hour_watch_cnts.map((v, idx) => ({
          time: TIME_LABELS[idx],
          views: v,
        }));

        setDayData(mappedDay);
        setTimeData(mappedHour);
      } catch (err) {
        console.error("❌ TimePatternSection 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId, month]);

  /** 최고 시청 요일 / 시간대 계산 */
  const peakDay = useMemo(() => dayData.reduce((a, b) => (a.views > b.views ? a : b), { day: "", views: 0 }), [dayData]);
  const peakTime = useMemo(() => timeData.reduce((a, b) => (a.views > b.views ? a : b), { time: "", views: 0 }), [timeData]);

  const maxDayViews = peakDay.views;
  const maxTimeViews = peakTime.views;

  if (loading)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center text-gray-500">
        시청 패턴 불러오는 중...
      </div>
    );

  return (
    <div className="w-full">

      {/* 필터바 */}
      <div className="mb-4">
        <ReportFilterBar
          selectedMonth={month}
          onChangeMonth={handleMonthChange}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">시청 패턴</h3>
          </div>
          <p className="text-sm text-gray-600">
            요일별, 시간대별 사용자 시청 활동 패턴 분석
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 요일별 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-blue-600" />
              <p className="text-sm font-semibold text-gray-700">요일별 시청 수</p>
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {dayData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.views === maxDayViews ? "#3b82f6" : "#93c5fd"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                가장 높은 활동:{" "}
                <span className="font-semibold">{peakDay?.day}요일</span>
              </p>
            </div>
          </div>

          {/* 시간대별 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-green-600" />
              <p className="text-sm font-semibold text-gray-700">시간대별 시청 수</p>
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
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {timeData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.views === maxTimeViews ? "#10b981" : "#6ee7b7"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                가장 활발한 시간대:{" "}
                <span className="font-semibold">{peakTime?.time}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePatternSection;