import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Video {
  id: number;
  title: string;
  progress: number;
  date: string;
}

interface Organization {
  id: number;
  name: string;
  logo: string;
  videos: Video[];
}

const LearningSection: React.FC = () => {
  const navigate = useNavigate();

  // 현재 접속한 조직 (추후 Context나 Redux에서 가져올 예정)
  const currentOrgName = "우리 FISA";

  // 예시 데이터 (추후 API 연동 예정)
  const orgs: Organization[] = [
    {
      id: 1,
      name: "우리 FISA",
      logo: "/dummy/woori-logo.png",
      videos: [
        { id: 101, title: "AI 개념과 적용 사례", progress: 80, date: "2025.10.15" },
        { id: 102, title: "머신러닝 모델링 기초", progress: 60, date: "2025.10.13" },
        { id: 103, title: "딥러닝 네트워크 이해", progress: 100, date: "2025.10.10" },
        { id: 104, title: "AI 프로젝트 실습", progress: 70, date: "2025.10.09" },
        { id: 105, title: "AI 윤리와 데이터 보호", progress: 20, date: "2025.10.08" },
      ],
    },
    {
      id: 2,
      name: "PASTA EDU",
      logo: "/dummy/woori-logo.png",
      videos: [
        { id: 106, title: "강화학습 실습 입문", progress: 45, date: "2025.10.17" },
        { id: 107, title: "생성형 AI 모델 구조", progress: 25, date: "2025.10.12" },
        { id: 108, title: "OpenAI 모델 이해", progress: 90, date: "2025.10.11" },
        { id: 109, title: "AI API 연동 실습", progress: 55, date: "2025.10.10" },
      ],
    },
  ];

  // 현재 조직만 필터링
  const currentOrg = orgs.find(org => org.name === currentOrgName);

  // "더보기" 상태 관리
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  // 현재 조직이 없으면 메시지 표시
  if (!currentOrg) {
    return (
      <div className="text-center py-10">
        <p className="text-text-muted">선택된 조직이 없습니다.</p>
      </div>
    );
  }

  const videosToShow = isExpanded ? currentOrg.videos : currentOrg.videos.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">최근 시청 기록</h2>
        </div>

        {currentOrg.videos.length > 3 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "접기" : `더보기 (${currentOrg.videos.length}개)`}
          </button>
        )}
      </div>

      {/* 영상 카드 목록 */}
      <div className="grid gap-5 md:grid-cols-3">
        {videosToShow.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video.id)}
            className="cursor-pointer p-4 bg-white border border-border-light rounded-lg shadow-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            {/* 썸네일 자리 */}
            <div className="w-full h-40 bg-gray-200 rounded-md mb-3"></div>

            {/* 영상 제목 */}
            <h4 className="text-base font-medium text-text-primary truncate">
              {video.title}
            </h4>

            {/* 시청 날짜 */}
            <p className="text-xs text-text-muted mt-1">최근 시청일: {video.date}</p>

            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${video.progress}%` }}
              ></div>
            </div>

            {/* 퍼센트 */}
            <p className="text-xs text-text-secondary mt-1">
              시청률 {video.progress}%
            </p>
          </div>
        ))}
      </div>

      {/* 영상이 없는 경우 */}
      {currentOrg.videos.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p>아직 시청한 영상이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default LearningSection;