import React, { useEffect, useState } from "react";
import { Trophy, Eye, TrendingUp, Calendar } from "lucide-react";
import { fetchTopRankVideos } from "@/api/adminStats/report";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
    case 3:
      return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getRankIcon = (rank: number) => {
  if (rank <= 3) return <Trophy size={18} />;
  return null;
};

const VideoRankingSection: React.FC = () => {
  const orgId = Number(localStorage.getItem("org_id"));

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // API 호출
  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchTopRankVideos(orgId);

        const mapped = list.map((v: any, idx: number) => ({
          id: idx + 1,
          title: v.title,
          views: v.watch_cnt,
          completion: v.watch_complete_rate,
          uploadDate: v.created_at.split("T")[0],
        }));

        setVideos(mapped);
      } catch (e) {
        console.error("❌ 인기 동영상 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-800">인기 동영상 TOP 5</h3>
          </div>
          <p className="text-sm text-gray-600">
            조회수 및 완료율 기준 인기 영상 목록
          </p>
        </div>
      </div>

      {/* 로딩 */}
      {loading ? (
        <LoadingSpinner text="로딩 중..." />
      ) : videos.length === 0 ? (
        /* 데이터 없음 안내 */
        <div className="py-16 text-gray-500 text-center border border-gray-200 rounded-lg bg-gray-50">
         아직 데이터가 없습니다.
        </div>
      ) : (
        /* 동영상 목록 */
        <div className="space-y-3">
          {videos.map((video, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${
                  rank === 1
                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-sm"
                    : rank === 2
                    ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300"
                    : rank === 3
                    ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                {/* 순위 */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg ${getRankBadge(
                    rank
                  )}`}
                >
                  {rank <= 3 ? getRankIcon(rank) : rank}
                </div>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {video.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {video.uploadDate}
                    </span>
                  </div>
                </div>

                {/* 조회수 */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye size={14} className="text-blue-600" />
                      <p className="text-xs text-gray-600">조회수</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {video.views}
                    </p>
                  </div>

                  {/* 완료율 */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp size={14} className="text-green-600" />
                      <p className="text-xs text-gray-600">완료율</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {video.completion}%
                    </p>
                  </div>
                </div>

                {/* 완료율 바 */}
                <div className="w-24 flex-shrink-0">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        video.completion >= 90
                          ? "bg-green-500"
                          : video.completion >= 80
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${video.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideoRankingSection;