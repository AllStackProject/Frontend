// src/components/Home/VideoGrid.tsx
import VideoCard from '@/components/Home/VideoCard';

const VideoGrid = () => {
  // 더미 데이터에 추가 정보 포함
  const dummyVideos = Array(10).fill(null).map((_, index) => ({
    videoId: `video-${index + 1}`,
    thumbnail: '/dummy/thum.png',
    title: '샘플 강의 제목입니다 샘플 제목 입니다',
    author: '인사팀',
    duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    views: Math.floor(Math.random() * 10000) + 100,
    uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isFavorite: Math.random() > 0.7, // 30% 확률로 즐겨찾기
  }));

  const handleFavoriteToggle = (videoId: string, isFavorite: boolean) => {
    // TODO: 백엔드 API 연동
    console.log(`영상 ${videoId} 즐겨찾기 ${isFavorite ? '추가' : '제거'}`);
  };

  const sections = [
    { 
      icon: '/icon/new-lectures.png', 
      title: '최신 강의', 
      color: 'text-info' 
    },
    { 
      icon: '/icon/hot-lectures.png', 
      title: '인기 강의', 
      color: 'text-warning' 
    },
    { 
      icon: '/icon/recommended-lectures.png', 
      title: '추천 강의', 
      color: 'text-accent' 
    },
  ];

  return (
    <div className="space-y-10">
      {sections.map(({ icon, title, color }, index) => (
        <section key={index} className="pt-6">
          {/* 섹션 타이틀 */}
          <div className="flex justify-between items-center mb-3">
            <h2 className={`flex items-center gap-2 text-xl font-semibold ${color}`}>
              <img 
                src={icon} 
                alt={title} 
                className="w-12 h-12 object-contain" 
              />
              {title}
            </h2>
            <button className="text-sm text-primary hover:underline transition-colors">
              더보기
            </button>
          </div>

          {/* 가로 스크롤 영상 리스트 */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
            {dummyVideos.slice(0, 5).map((video, idx) => (
              <VideoCard key={idx} {...video} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default VideoGrid;