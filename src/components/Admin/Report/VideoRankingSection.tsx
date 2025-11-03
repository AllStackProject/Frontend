import React from "react";
import { Trophy, Play, Eye, TrendingUp, Calendar } from "lucide-react";

const topVideos = [
  { 
    id: 1,
    title: "AI 트렌드 2025", 
    views: 520, 
    completion: 94,
    uploadDate: "2025-09-05",
    videoUrl: "/admin/videos/1"
  },
  { 
    id: 2,
    title: "윤리 교육 가이드", 
    views: 480, 
    completion: 88,
    uploadDate: "2025-08-20",
    videoUrl: "/admin/videos/2"
  },
  { 
    id: 3,
    title: "보안의 기본", 
    views: 400, 
    completion: 92,
    uploadDate: "2025-09-10",
    videoUrl: "/admin/videos/3"
  },
  { 
    id: 4,
    title: "신입사원 교육", 
    views: 390, 
    completion: 87,
    uploadDate: "2025-08-15",
    videoUrl: "/admin/videos/4"
  },
  { 
    id: 5,
    title: "AI 윤리와 법", 
    views: 310, 
    completion: 90,
    uploadDate: "2025-09-25",
    videoUrl: "/admin/videos/5"
  },
];

// 순위별 배지 색상
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

// 순위별 아이콘
const getRankIcon = (rank: number) => {
  if (rank <= 3) {
    return <Trophy size={18} />;
  }
  return null;
};

const VideoRankingSection: React.FC = () => {
  const totalViews = topVideos.reduce((sum, v) => sum + v.views, 0);
  const avgCompletion = Math.round(
    topVideos.reduce((sum, v) => sum + v.completion, 0) / topVideos.length
  );

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
            조회수와 완료율이 높은 상위 동영상 목록
          </p>
        </div>
      </div>

      {/* 동영상 목록 */}
      <div className="space-y-3">
        {topVideos.map((video, idx) => {
          const rank = idx + 1;
          return (
            <div
              key={video.id}
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
              {/* 순위 배지 */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg flex-shrink-0 ${getRankBadge(
                  rank
                )}`}
              >
                {rank <= 3 ? getRankIcon(rank) : rank}
              </div>

              {/* 동영상 정보 */}
              <div className="flex-1 min-w-0">
                <a
                  href={video.videoUrl}
                  className="text-sm font-semibold text-gray-800 hover:text-blue-600 hover:underline transition-colors block mb-1"
                >
                  {video.title}
                </a>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {video.uploadDate}
                  </span>
                </div>
              </div>

              {/* 통계 */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Eye size={14} className="text-blue-600" />
                    <p className="text-xs text-gray-600">조회수</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {video.views.toLocaleString()}
                  </p>
                </div>

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

              {/* 완료율 프로그레스 바 */}
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

      {/* 하단 인사이트 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Trophy size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-yellow-900 mb-0.5">
              1위 동영상
            </p>
            <p className="text-xs text-yellow-700">
              "{topVideos[0].title}"이(가) {topVideos[0].views.toLocaleString()}회 조회로 1위를 차지했습니다.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <TrendingUp size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-green-900 mb-0.5">
              높은 완료율
            </p>
            <p className="text-xs text-green-700">
              상위 5개 동영상의 평균 완료율은 {avgCompletion}%로 우수합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRankingSection;