interface AdBannerProps {
  image?: string;
}

const AdBanner = ({ image = "/icon/AD.png" }: AdBannerProps) => {
  return (
    <div
      className="relative w-full h-60 rounded-2xl overflow-hidden shadow-xl 
                 group perspective-1000 mb-6"
    >
      {/* 배경 이미지 */}
      <img
        src={image}
        alt="광고 배너"
        className="w-full h-full object-cover transition-transform duration-700"
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 from-black/10 to-black/30"></div>

      {/* subtle top light */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-10"></div>
    </div>
  );
};

export default AdBanner;