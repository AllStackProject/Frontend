export default function BrandSection() {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary to-primary-light p-12">
      <div className="text-center text-white">
        {/* 로고/일러스트 영역 */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Privideo Logo" 
                className="w-30 h-30 object-contain"
              />
            </div>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              
      </div>
          </div>
        </div>

        {/* 브랜드 메시지 */}
        <h2 className="text-3xl font-bold mb-4">Privideo</h2>
        <p className="text-lg text-white/90 mb-2">
          하이브리드 클라우드 기반
        </p>
        <p className="text-lg text-white/90">
          프라이빗 스트리밍 플랫폼
        </p>

        {/* 특징 */}
        <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">✓</span>
            </div>
            <p className="text-white/90">안전한 프라이빗 영상 관리</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">✓</span>
            </div>
            <p className="text-white/90">하이브리드 클라우드 스토리지</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-bold">✓</span>
            </div>
            <p className="text-white/90">간편한 공유 및 권한 관리</p>
          </div>
        </div>
      </div>
    </div>
  );
}