import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, X } from "lucide-react";
import { fetchAdminMemberReport } from "@/api/adminStats/view";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface LearningReportModalProps {
  onClose: () => void;
  memberId: number;
  nickname: string;
}

const LearningReportModal: React.FC<LearningReportModalProps> = ({
  onClose,
  memberId,
  nickname,
}) => {
  const { orgId } = useAuth();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  if (!open) return null;

  /** 멤버 리포트 로드 */
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminMemberReport(orgId || 0, memberId);
        setReport(data);
      } catch (err) {
        console.error("❌ 멤버 리포트 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [orgId, memberId]);

  /** 그래프 데이터 변환 */
  const chartData =
    report?.monthly_watched_cnts?.map((m: any) => ({
      date: `${m.year}-${m.month}`,
      views: m.watched_video_cnt,
    })) ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600" />
            {nickname}님의 학습 리포트
          </h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-52">
              <LoadingSpinner text="로딩 중..." />
            </div>
          ) : report ? (
            <>
              {/* 요약 카드 */}
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                {/* 완료 영상 수 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">시청 완료 영상 수</p>
                  <p className="text-xl font-bold text-blue-600">
                    {report.total_watched_video_cnt}
                    <span className="text-xs ml-1 text-gray-400">개</span>
                  </p>
                </div>

                {/* 가장 많이 본 카테고리 */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-center">
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
                      <span className="text-gray-400 text-xs">아직 없음</span>
                    )}
                  </div>
                </div>

              </div>

              {/* 그래프 */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="font-semibold mb-3">월별 시청 활동 추이</h3>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    기록이 없습니다.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              데이터가 없습니다.
            </div>
          )}
        </div>

        {/* 하단 */}
        <div className="p-4 border-t text-right bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-white"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};

export default LearningReportModal;