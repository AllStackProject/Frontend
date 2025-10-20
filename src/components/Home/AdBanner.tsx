// src/components/Home/AdBanner.tsx

interface AdBannerProps {
  image?: string;
  title?: string;
  badge?: string;
  link?: string;
}

const AdBanner = ({ 
  image = '/AD2.png',
  title = '직무 향상 워크숍',
  badge = '지금 바로 신청 !',
  link
}: AdBannerProps) => {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="relative w-full h-60 rounded-2xl overflow-hidden shadow-xl cursor-pointer group perspective-1000 mb-6"
    >
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 transform transition-transform duration-500 group-hover:scale-105"></div>
      
      {/* 배너 이미지 */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* 어두운 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      {/* 3D 하이라이트 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* 텍스트 */}
      <div className="absolute bottom-4 left-6 text-white drop-shadow-2xl z-10">
        {badge && (
          <p className="text-xs font-bold bg-accent text-black px-4 py-1.5 rounded-full inline-block mb-2 shadow-lg transform transition-transform group-hover:scale-110">
            {badge}
          </p>
        )}
        <h3 className="text-lg font-bold transform transition-transform group-hover:translate-x-1">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default AdBanner;