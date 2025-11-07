import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchedVideos } from "@/api/myactivity/getWatchedVideos";
import { useAuth } from "@/context/AuthContext";

interface Video {
  id: number;
  name: string;
  img: string;
  watch_rate: number;
  recent_watch: string;
}

const LearningSection: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔹 시청 기록 불러오기
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!orgId) {
          setError("조직 정보가 없습니다.");
          return;
        }
        setLoading(true);
        const data = await getWatchedVideos(orgId);
        setVideos(data);
      } catch (err: any) {
        setError(err.message || "시청 기록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [orgId]);

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        시청 기록 불러오는 중...
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  // 영상 없음
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        <p>아직 시청한 영상이 없습니다.</p>
      </div>
    );
  }

  const videosToShow = isExpanded ? videos : videos.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">최근 시청 기록</h2>
          {videos.length > 0 && (
            <span className="text-sm text-text-muted">
              ({videos.length}개)
            </span>
          )}
        </div>

        {videos.length > 3 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "접기" : `더보기`}
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
            {/* 썸네일 */}
            <div className="w-full h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
              <img
                src={video.img || "/dummy/video-thumb.png"}
                alt={video.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 제목 */}
            <h4 className="text-base font-medium text-text-primary truncate">
              {video.name}
            </h4>

            {/* 시청 날짜 */}
            <p className="text-xs text-text-muted mt-1">
              최근 시청일: {new Date(video.recent_watch).toLocaleDateString()}
            </p>

            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(video.watch_rate).toFixed(0)}%` }}
              ></div>
            </div>

            {/* 퍼센트 */}
            <p className="text-xs text-text-secondary mt-1">
              시청률 {(video.watch_rate).toFixed(0)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningSection;