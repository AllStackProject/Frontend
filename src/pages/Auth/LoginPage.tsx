import LoginForm from '@/components/login/LoginForm';
import BrandSection from '@/components/login/BrandSection';

export default function LoginHome() {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-bg-card rounded-2xl shadow-base overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* 좌측: 로그인 폼 */}
          <div className="p-8 lg:p-12">
            <LoginForm />
          </div>

          {/* 우측: 브랜드 섹션 */}
          <BrandSection />
        </div>
      </div>
    </div>
  );
}