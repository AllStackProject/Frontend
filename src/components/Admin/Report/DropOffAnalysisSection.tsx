import React from "react";
import { AlertTriangle, ThumbsUp, TrendingDown, TrendingUp } from "lucide-react";

const dropOffHigh = [
  { 
    id: 1,
    title: "보안 가이드 101", 
    dropOff: 42, 
    avgTime: "15분",
    uploadDate: "2025-09-15",
    videoUrl: "/admin/videos/1"
  },
  { 
    id: 2,
    title: "AI 개론", 
    dropOff: 35, 
    avgTime: "22분",
    uploadDate: "2025-09-22",
    videoUrl: "/admin/videos/2"
  },
  { 
    id: 3,
    title: "윤리 교육", 
    dropOff: 33, 
    avgTime: "18분",
    uploadDate: "2025-10-01",
    videoUrl: "/admin/videos/3"
  },
];

const dropOffLow = [
  { 
    id: 4,
    title: "신입사원 오리엔테이션", 
    dropOff: 5, 
    avgTime: "45분",
    uploadDate: "2025-08-10",
    videoUrl: "/admin/videos/4"
  },
  { 
    id: 5,
    title: "AI 트렌드 2025", 
    dropOff: 7, 
    avgTime: "38분",
    uploadDate: "2025-09-05",
    videoUrl: "/admin/videos/5"
  },
  { 
    id: 6,
    title: "리더십 교육", 
    dropOff: 9, 
    avgTime: "42분",
    uploadDate: "2025-09-18",
    videoUrl: "/admin/videos/6"
  },
];

const DropOffAnalysisSection: React.FC = () => (
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
      {/* 이탈률 높은 영상 */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800">이탈률이 높은 영상</h4>
            <p className="text-xs text-gray-600">개선이 필요한 콘텐츠</p>
          </div>
        </div>

        <div className="space-y-3">
          {dropOffHigh.map((v, i) => (
            <div
              key={i}
              className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <a
                    href={v.videoUrl}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {v.title}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">업로드: {v.uploadDate}</p>
                </div>
                <span className="text-lg font-bold text-red-600 ml-2">{v.dropOff}%</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingDown size={12} className="text-red-600" />
                  이탈률
                </span>
                <span>평균 시청: {v.avgTime}</span>
              </div>
              {/* 프로그레스 바 */}
              <div className="mt-2 h-1.5 bg-red-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${v.dropOff}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 요약 */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">개선 제안:</span> 높은 이탈률 영상은 콘텐츠 길이, 난이도, 또는 구성을 재검토해보세요.
          </p>
        </div>
      </div>

      {/* 이탈률 낮은 영상 */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
            <ThumbsUp size={18} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800">이탈률이 낮은 영상</h4>
            <p className="text-xs text-gray-600">추천 우수 콘텐츠</p>
          </div>
        </div>

        <div className="space-y-3">
          {dropOffLow.map((v, i) => (
            <div
              key={i}
              className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <a
                    href={v.videoUrl}
                    className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                  >
                    {v.title}
                  </a>
                  <p className="text-xs text-gray-500 mt-1">업로드: {v.uploadDate}</p>
                </div>
                <span className="text-lg font-bold text-green-600 ml-2">{v.dropOff}%</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} className="text-green-600" />
                  완료율
                </span>
                <span>평균 시청: {v.avgTime}</span>
              </div>
              {/* 프로그레스 바 */}
              <div className="mt-2 h-1.5 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${100 - v.dropOff}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 요약 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">모범 사례:</span> 낮은 이탈률 영상의 구성 방식을 참고하여 다른 콘텐츠에 적용해보세요.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default DropOffAnalysisSection;