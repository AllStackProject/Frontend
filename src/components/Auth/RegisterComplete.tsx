// src/components/Auth/RegisterComplete.tsx

interface RegisterCompleteProps {
  onLogin: () => void;
}

export default function RegisterComplete({ onLogin }: RegisterCompleteProps) {
  return (
    <div className="text-center py-12">
      {/* 성공 아이콘 */}
      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* 완료 메시지 */}
      <h3 className="text-2xl font-bold text-text-primary mb-3">
        회원가입이 완료되었습니다!
      </h3>
      <p className="text-text-secondary mb-8">
        Privideo의 모든 기능을 이용하실 수 있습니다.
      </p>

      {/* 로그인 버튼 */}
      <button
        type="button"
        onClick={onLogin}
        className="px-10 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors shadow-lg"
      >
        로그인하기
      </button>
    </div>
  );
}