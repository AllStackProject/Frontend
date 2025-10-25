interface AdBannerProps {
  image?: string;
}

const AdBanner = ({ image = "/AD2.png" }: AdBannerProps) => {
  return (
    <div
      className="relative w-full h-60 rounded-2xl overflow-hidden shadow-xl group perspective-1000 mb-6 select-none cursor-default"
      onClick={(e) => e.preventDefault()} // 클릭 이벤트 차단
    >
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transform transition-transform duration-500 pointer-events-none"></div>

      {/* 배너 이미지 */}
      <img
        src={image}
        alt="광고 배너"
        className="w-full h-full object-cover transform transition-transform duration-500 pointer-events-none"
      />

      {/* 3D 하이라이트 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default AdBanner;