import React, { useState } from "react";
import { Mail, Key, Lock, CheckCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const LoginPasswordReset: React.FC = () => {
  const { openModal, closeModal } = useModal();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* -----------------------------
      Step 1 - 이메일 전송
  ------------------------------ */
  const handleSendCode = async () => {
    if (!email.includes("@")) {
      openModal({
        type: "error",
        title: "이메일 오류",
        message: "유효한 이메일 주소를 입력하세요.",
        confirmText: "확인",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      
      setStep(2);
    }, 1000);
  };


  /* -----------------------------
      Step 2 - 인증 코드 확인
  ------------------------------ */
  const handleVerifyCode = async () => {
    if (code.trim().length !== 6) {
      openModal({
        type: "error",
        title: "코드 오류",
        message: "6자리 인증 코드를 입력하세요.",
        confirmText: "확인",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      
      setStep(3);
    }, 1000);
  };

  /* -----------------------------
     Step 3 - 비밀번호 재설정
 ------------------------------ */
  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      openModal({
        type: "error",
        title: "비밀번호 오류",
        message: "비밀번호는 8자 이상이어야 합니다.",
        confirmText: "확인",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      openModal({
        type: "error",
        title: "비밀번호 불일치",
        message: "비밀번호가 일치하지 않습니다.",
        confirmText: "확인",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      
      setSuccess(true);

      openModal({
        type: "success",
        title: "비밀번호 재설정 완료",
        message: "새로운 비밀번호로 로그인할 수 있습니다.",
        confirmText: "확인",
        autoClose: true,
        autoCloseDelay: 1500,
      });
    }, 1000);
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-bg-page px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              비밀번호 재설정
            </h1>
            <p className="text-text-secondary text-sm">
              계정의 비밀번호를 재설정합니다.
            </p>
          </div>

          {!success ? (
            <>
              {/* Step 1 - 이메일 입력 */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    등록된 이메일 주소
                  </label>
                  <div className="relative mb-6">
                    <Mail
                      size={18}
                      className="absolute left-3 top-3 text-text-muted"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSendCode}
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:shadow-md transition disabled:opacity-50"
                  >
                    {loading ? "전송 중..." : "인증 코드 보내기"}
                  </button>
                </div>
              )}

              {/* Step 2 - 인증 코드 입력 */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    이메일로 전송된 인증 코드 (6자리)
                  </label>
                  <div className="relative mb-6">
                    <Key
                      size={18}
                      className="absolute left-3 top-3 text-text-muted"
                    />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:shadow-md transition disabled:opacity-50"
                  >
                    {loading ? "확인 중..." : "코드 확인"}
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full mt-3 text-sm text-text-link underline"
                  >
                    이메일 다시 입력하기
                  </button>
                </div>
              )}

              {/* Step 3 - 새 비밀번호 설정 */}
              {step === 3 && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    새 비밀번호
                  </label>
                  <div className="relative mb-4">
                    <Lock
                      size={18}
                      className="absolute left-3 top-3 text-text-muted"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 입력"
                      className="w-full pl-10 pr-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <label className="block text-sm font-medium text-text-primary mb-2">
                    비밀번호 확인
                  </label>
                  <div className="relative mb-6">
                    <Lock
                      size={18}
                      className="absolute left-3 top-3 text-text-muted"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호 재입력"
                      className="w-full pl-10 pr-3 py-2 border border-border-light rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:shadow-md transition disabled:opacity-50"
                  >
                    {loading ? "변경 중..." : "비밀번호 재설정"}
                  </button>
                </div>
              )}
            </>
          ) : (
            // 완료 화면
            <div className="text-center py-12">
              <CheckCircle
                size={60}
                className="text-success mx-auto mb-4 animate-bounce"
              />
              <h2 className="text-xl font-bold text-text-primary mb-2">
                비밀번호가 변경되었습니다!
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                이제 새로운 비밀번호로 로그인할 수 있습니다.
              </p>
              <a
                href="/login"
                className="inline-block bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2 rounded-lg font-semibold hover:shadow-md transition"
              >
                로그인으로 돌아가기
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPasswordReset;