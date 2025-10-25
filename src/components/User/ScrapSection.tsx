import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";

interface Video {
  id: number;
  title: string;
  organization: string;
  organizationLogo?: string;
  uploadDate: string;
  progress: number;
  thumbnail?: string;
  isScrapped: boolean;
}

const ScrapSection: React.FC = () => {
  const navigate = useNavigate();

  // 현재 접속한 조직 (추후 Context나 Redux에서 가져올 예정)
  const currentOrgName = "우리 FISA"; // 또는 localStorage.getItem('currentOrg')

  // 예시 데이터 (추후 API 연동 예정)
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: "AI 개념과 적용 사례",
      organization: "우리 FISA",
      organizationLogo: "/dummy/woori-logo.png",
      uploadDate: "2025.10.10",
      progress: 75,
      thumbnail: "/thum.png",
      isScrapped: true,
    },
    {
      id: 2,
      title: "딥러닝 네트워크 이해",
      organization: "PASTA EDU",
      organizationLogo: "/dummy/woori-logo.png",
      uploadDate: "2025.10.12",
      progress: 50,
      thumbnail: "/thum.png",
      isScrapped: true,
    },
    {
      id: 3,
      title: "머신러닝 모델링 기초",
      organization: "우리 FISA",
      organizationLogo: "/dummy/woori-logo.png",
      uploadDate: "2025.10.08",
      progress: 30,
      thumbnail: "/thum.png",
      isScrapped: true,
    },
    {
      id: 4,
      title: "자연어 처리 실습",
      organization: "우리 FISA",
      organizationLogo: "/dummy/woori-logo.png",
      uploadDate: "2025.10.05",
      progress: 90,
      thumbnail: "/thum.png",
      isScrapped: true,
    },
  ]);

  // 현재 조직의 스크랩된 영상만 필터링
  const filteredVideos = videos.filter(
    (video) => video.organization === currentOrgName && video.isScrapped
  );

  const handleNavigate = (id: number) => {
    navigate(`/video/${id}`);
  };

  const toggleScrap = (id: number) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, isScrapped: !v.isScrapped } : v
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* 타이틀 */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-text-primary">내 스크랩</h2>
        {filteredVideos.length > 0 && (
          <span className="text-sm text-text-muted">
            ({filteredVideos.length}개)
          </span>
        )}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border-light">
          <Heart className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-text-muted text-sm">
            {currentOrgName}에 스크랩한 영상이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleNavigate(video.id)}
              className="cursor-pointer p-4 bg-white border border-border-light rounded-lg shadow-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              {/* 썸네일 */}
              <div className="relative w-full h-40 bg-gray-200 rounded-md mb-3">
                {/* 스크랩 아이콘 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScrap(video.id);
                  }}
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                >
                  {video.isScrapped ? (
                    <Heart className="text-[#E25A5A] fill-[#E25A5A]" size={20} />
                  ) : (
                    <HeartOff className="text-gray-400" size={20} />
                  )}
                </button>
              </div>

              {/* 영상 제목 */}
              <h4 className="text-base font-medium text-text-primary truncate">
                {video.title}
              </h4>

              {/* 시청 날짜 */}
              <p className="text-xs text-text-muted mt-1">최근 시청일: {video.uploadDate}</p>

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
      )}
    </div>
  );
};

export default ScrapSection;