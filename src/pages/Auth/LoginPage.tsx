import LoginForm from '@/components/login/LoginForm';

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
          <div className="hidden lg:flex items-center justify-center bg-[#2e1074] from-primary to-primary-light">
            <div className="text-center text-white">
              <img
                src="/brand.png"
                alt="Privideo 홍보 이미지"
                className="max-w-[80%] h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}