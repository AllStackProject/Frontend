import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import { HiClock } from "react-icons/hi";
import { getScrapVideos } from "@/api/myactivity/getScrap";
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap";
import type { ScrapVideo } from "@/types/scrap";

type ScrapVideoWithState = ScrapVideo & { is_scrapped?: boolean };

const ScrapSection: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<ScrapVideoWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const orgId = Number(localStorage.getItem("org_id"));
  const orgName = localStorage.getItem("org_name") || "조직 미선택";

  /** 스크랩 목록 불러오기 */
  useEffect(() => {
    const fetchScraps = async () => {
      try {
        setLoading(true);
        const data = await getScrapVideos(orgId);
        const formatted = data.map((v: ScrapVideo) => ({
          ...v,
          is_scrapped: true,
        }));
        setVideos(formatted);
      } catch (err: any) {
        console.error("❌ [ScrapSection] 스크랩 목록 로드 실패:", err);
        setError(err.message || "스크랩 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchScraps();
  }, [orgId]);

  /** 스크랩 토글 */
  const toggleScrap = async (
    e: React.MouseEvent,
    id: number,
    currentState?: boolean
  ) => {
    e.stopPropagation();
    if (loadingId === id) return;
    setLoadingId(id);

    try {
      if (currentState) {
        const res = await deleteVideoScrap(orgId, id);
        if (res.is_success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, is_scrapped: false } : v))
          );
        }
      } else {
        const res = await postVideoScrap(orgId, id);
        if (res.is_success) {
          setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, is_scrapped: true } : v))
          );
        }
      }
    } catch (error: any) {
      alert(error.message || "스크랩 처리 중 오류가 발생했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  /** 영상 상세 이동 */
  const handleNavigate = (id: number) => {
    navigate(`/video/${id}`);
  };

  // 초를 "분:초" 형태로 변환하는 유틸 함수
const formatDuration = (seconds?: number): string => {
  if (!seconds && seconds !== 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

  if (loading)
    return <p className="text-center py-16 text-gray-500">로딩 중...</p>;
  if (error)
    return <p className="text-center py-16 text-red-500">{error}</p>;
  if (videos.length === 0)
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border-light">
        <Heart className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-text-muted text-sm">
          {orgName}에 스크랩한 영상이 없습니다.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">내 스크랩</h2>
          {videos.length > 0 && (
            <span className="text-sm text-text-muted">({videos.length}개)</span>
          )}
        </div>

        {/* 더보기 / 접기 버튼 */}
        {videos.length > 4 && (
          <button
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "접기" : "더보기"}
          </button>
        )}
      </div>


      {/* 영상 리스트 */}
      <div className="flex flex-col divide-y divide-gray-200">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleNavigate(video.id)}
            className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition"
          >
            {/* 썸네일 */}
            <div className="relative w-full sm:w-52 aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-sm">
              <img
                src={video.img || "/dummy/thumb1.png"}
                alt={video.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {/* 재생 시간 */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <HiClock className="text-sm" />
                {formatDuration(video.whole_time)}  
              </div>

              {/* 스크랩 버튼 */}
              <button
                onClick={(e) => toggleScrap(e, video.id, video.is_scrapped)}
                disabled={loadingId === video.id}
                className={`absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition z-10 ${loadingId === video.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {video.is_scrapped ? (
                  <Heart
                    className="text-[#E25A5A] fill-[#E25A5A] transition-transform duration-200 hover:scale-110"
                    size={20}
                  />
                ) : (
                  <HeartOff
                    className="text-gray-400 transition-transform duration-200 hover:scale-110"
                    size={20}
                  />
                )}
              </button>

              {/* 시청률 바 */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
                <div
                  className="bg-primary h-1"
                  style={{ width: `${video.watch_rate || 0}%` }}
                ></div>
              </div>
            </div>

            {/* 오른쪽 정보 */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-base font-semibold text-text-primary line-clamp-2 mb-1">
                  {video.name}
                </h3>
                <p className="text-xs text-text-muted">
                  최근 시청일:{" "}
                  {new Date(video.recent_watch).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrapSection;