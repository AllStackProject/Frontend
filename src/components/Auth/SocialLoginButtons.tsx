// src/components/Auth/SocialLoginButtons.tsx

export default function SocialLoginButtons() {
  const handleSocialLogin = (provider: string) => {
    // ✅ TODO: 소셜 로그인 API 연동
    console.log(`${provider} 로그인`);
  };

  return (
    <div className="mt-6">
      <p className="text-center text-sm text-text-secondary mb-4">
        SNS 계정으로 간편하게 로그인
      </p>

      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-border-light rounded-lg hover:border-primary hover:bg-bg-page transition-colors"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xs text-text-secondary">Google</span>
        </button>

        {/* Kakao */}
        <button
          type="button"
          onClick={() => handleSocialLogin('Kakao')}
          className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-border-light rounded-lg hover:border-primary hover:bg-bg-page transition-colors"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-gray-800 font-bold text-lg">K</span>
          </div>
          <span className="text-xs text-text-secondary">Kakao</span>
        </button>

        {/* Naver */}
        <button
          type="button"
          onClick={() => handleSocialLogin('Naver')}
          className="flex flex-col items-center justify-center gap-2 py-3 px-4 border border-border-light rounded-lg hover:border-primary hover:bg-bg-page transition-colors"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xs text-text-secondary">Naver</span>
        </button>
      </div>
    </div>
  );
}