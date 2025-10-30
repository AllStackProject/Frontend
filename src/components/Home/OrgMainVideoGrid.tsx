import { useNavigate } from "react-router-dom";
import VideoCard from "@/components/Home/VideoCard";

const VideoGrid = () => {
  const navigate = useNavigate();

  // 더미 데이터 생성
  const dummyVideos = Array(10)
    .fill(null)
    .map((_, index) => ({
      videoId: `video-${index + 1}`,
      thumbnail: "/dummy/thum1.png",
      title: "샘플 강의 제목입니다 샘플 제목 입니다",
      author: "인사팀",
      duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(
        Math.random() * 60
      )
        .toString()
        .padStart(2, "0")}`,
      views: Math.floor(Math.random() * 10000) + 100,
      uploadDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      isFavorite: Math.random() > 0.7, // 30% 확률로 즐겨찾기
    }));

  // 즐겨찾기 토글 핸들러
  const handleFavoriteToggle = (videoId: string, isFavorite: boolean) => {
    console.log(`영상 ${videoId} 즐겨찾기 ${isFavorite ? "추가" : "제거"}`);
    // TODO: 백엔드 연동 (PATCH /favorite API 등)
  };

  // 섹션 구성
  const sections = [
    {
      icon: "/icon/new-lectures.png",
      title: "최신 영상",
      color: "text-info",
      tag: "new",
    },
    {
      icon: "/icon/hot-lectures.png",
      title: "인기 영상",
      color: "text-warning",
      tag: "hot",
    },
    {
      icon: "/icon/recommended-lectures.png",
      title: "추천 영상",
      color: "text-accent",
      tag: "recommended",
    },
  ];

  // 더보기 클릭 시 이동
  const handleViewMore = (tag: string) => {
    navigate(`/videoList`);
  };

  return (
    <div className="space-y-10">
      {sections.map(({ icon, title, color, tag }, index) => (
        <section key={index} className="pt-6">
          {/* 섹션 헤더 */}
          <div className="flex justify-between items-center mb-3">
            <h2 className={`flex items-center gap-2 text-xl font-semibold ${color}`}>
              <img
                src={icon}
                alt={title}
                className="w-12 h-12 object-contain"
              />
              {title}
            </h2>
            <button
              onClick={() => handleViewMore(tag)}
              className="text-sm text-primary hover:underline transition-colors"
            >
              더보기
            </button>
          </div>

          {/* 영상 리스트 (가로 스크롤) */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
            {dummyVideos.slice(0, 5).map((video, idx) => (
              <VideoCard
                key={idx}
                {...video}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default VideoGrid;