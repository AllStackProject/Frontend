import React, { useEffect, useState } from "react";
import { AlertTriangle, ThumbsUp, TrendingDown, Calendar, TrendingUp } from "lucide-react";
import { fetchQuitAnalysis } from "@/api/admin/report";

interface QuitVideo {
  title: string;
  created_at: string;
  avg_watch_time: number; // 초 단위
  quit_rate: number; // %
}

function formatMinutes(sec: number): string {
  const min = Math.floor(sec / 60);
  return `${min}분`;
}

function formatDate(dateStr: string): string {
  return dateStr.split("T")[0];
}

const DropOffAnalysisSection: React.FC = () => {
  const orgId = Number(localStorage.getItem("org_id"));

  const [highQuit, setHighQuit] = useState<QuitVideo[]>([]);
  const [lowQuit, setLowQuit] = useState<QuitVideo[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchQuitAnalysis(orgId);

        setHighQuit(res.high_quit_rate_logs || []);
        setLowQuit(res.low_quit_rate_logs || []);
      } catch (err) {
        console.error("❌ 중도 이탈 분석 로드 실패:", err);
      }
    };

    load();
  }, [orgId]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown size={20} className="text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">중도 이탈 분석</h3>
        </div>
        <p className="text-sm text-gray-600">
          동영상별 이탈률을 분석하여 콘텐츠 개선 포인트를 파악합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 높은 이탈률 TOP */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">
                평균 이탈률 90% 이상인 동영상
              </h4>
              <p className="text-xs text-gray-600">개선이 필요한 콘텐츠</p>
            </div>
          </div>

          <div className="space-y-3">
            {highQuit.map((v, i) => (
              <div
                key={i}
                className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(v.created_at)}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600 ml-2">
                    {v.quit_rate}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingDown size={12} className="text-red-600" />
                  <span>평균 시청 시간: {formatMinutes(v.avg_watch_time)}</span>
                </div>

                <div className="mt-2 h-1.5 bg-red-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${v.quit_rate}%` }}
                  />
                </div>
              </div>
            ))}

            {highQuit.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">데이터 없음</p>
            )}
          </div>
        </div>

        {/* 낮은 이탈률 TOP */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-200">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
              <ThumbsUp size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800">
                평균 이탈률 90% 미만 동영상
              </h4>
              <p className="text-xs text-gray-600">추천 우수 콘텐츠</p>
            </div>
          </div>

          <div className="space-y-3">
            {lowQuit.map((v, i) => (
              <div
                key={i}
                className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(v.created_at)}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600 ml-2">
                    {v.quit_rate}%
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingUp size={12} className="text-green-600" />
                  <span>평균 시청 시간: {formatMinutes(v.avg_watch_time)}</span>
                </div>

                <div className="mt-2 h-1.5 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full"
                    style={{ width: `${100 - v.quit_rate}%` }}
                  />
                </div>
              </div>
            ))}

            {lowQuit.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">데이터 없음</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropOffAnalysisSection;