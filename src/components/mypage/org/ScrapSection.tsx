import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getScrapVideos } from "@/api/myactivity/getScrap";
import type { ScrapVideo } from "@/types/scrap";

const ScrapSection: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<ScrapVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleVideos = showAll ? videos : videos.slice(0, 3);

  const orgId = Number(localStorage.getItem("org_id"));
  const orgName = localStorage.getItem("org_name") || "조직 미선택";

  // ✅ API로 스크랩 목록 불러오기
  useEffect(() => {
    const fetchScraps = async () => {
      try {
        setLoading(true);
        const data = await getScrapVideos(orgId);
        setVideos(data);
      } catch (err: any) {
        console.error("❌ [ScrapSection] 스크랩 목록 로드 실패:", err);
        setError(err.message || "스크랩 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchScraps();
  }, [orgId]);

  const handleNavigate = (id: number) => {
    navigate(`/video/${id}`);
  };

  // ✅ 스크랩 해제 버튼 클릭 시 (UI에서만 제거)
  const toggleScrap = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  if (loading) return <p className="text-center py-16 text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      {/* 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">내 스크랩</h2>
          {videos.length > 0 && (
            <span className="text-sm text-text-muted">
              ({videos.length}개)
            </span>
          )}
        </div>

        {/* 더보기 / 접기 버튼 (오른쪽 정렬) */}
        {videos.length > 4 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "접기" : `더보기`}
          </button>
        )}
      </div>
      {videos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border-light">
          <Heart className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-text-muted text-sm">
            {orgName}에 스크랩한 영상이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {visibleVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleNavigate(video.id)}
              className="cursor-pointer p-4 bg-white border border-border-light rounded-lg shadow-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              {/* 썸네일 */}
              <div className="relative w-full h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
                <img
                  src={video.img || "/dummy/thumb1.png"}
                  alt={video.name}
                  className="w-full h-full object-cover rounded-md"
                />
                {/* 스크랩 아이콘 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleScrap(video.id);
                  }}
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10"
                >
                  <Heart className="text-[#E25A5A] fill-[#E25A5A]" size={20} />
                </button>
              </div>

              {/* 영상 제목 */}
              <h4 className="text-base font-medium text-text-primary truncate">
                {video.name}
              </h4>

              {/* 최근 시청일 */}
              <p className="text-xs text-text-muted mt-1">
                최근 시청일:{" "}
                {new Date(video.recent_watch).toLocaleDateString("ko-KR")}
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
      )}
    </div>
  );
};

export default ScrapSection;