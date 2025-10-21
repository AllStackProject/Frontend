// src/components/Auth/LoginForm.tsx
import { useState } from 'react';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { Link } from 'react-router-dom';

type Errors = { email?: string; password?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (v = values): Errors => {
    const e: Errors = {};
    if (!v.email.trim()) e.email = '이메일을 입력해 주세요.';
    else if (!emailRe.test(v.email)) e.email = '올바른 이메일 형식이 아니에요.';
    if (!v.password) e.password = '비밀번호를 입력해 주세요.';
    else if (v.password.length < 8) e.password = '비밀번호는 8자 이상이어야 해요.';
    return e;
  };

  const handleChange =
    (key: 'email' | 'password') =>
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [key]: ev.target.value };
      setValues(next);
      setErrors(validate(next));
    };

  const handleBlur = (key: 'email' | 'password') => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate());
  };

  const hasError = (k: keyof Errors) => !!errors[k] && touched[k];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    setTouched({ email: true, password: true });
    if (Object.keys(eMap).length > 0) return;
    // ✅ TODO: 백엔드 API 연동
    console.log('login submit', values);
  };

  const isInvalid = Object.keys(validate()).length > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 로고 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Privideo</h1>
        <p className="text-text-secondary text-sm">프라이빗 스트리밍 플랫폼</p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 이메일 입력 */}
        <div>
          <div
            className={`relative flex items-center border rounded-lg overflow-hidden transition-colors ${
              hasError('email')
                ? 'border-error'
                : 'border-border-light focus-within:border-primary'
            }`}
          >
            <HiMail className="absolute left-3 text-text-muted text-xl" aria-hidden />
            <input
              id="email"
              name="email"
              type="email"
              className="w-full pl-11 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
              placeholder="이메일을 입력해 주세요"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              aria-invalid={hasError('email')}
              aria-describedby="email-help"
              required
            />
          </div>
          {touched.email && errors.email && (
            <p id="email-help" className="mt-1 text-sm text-error">
              {errors.email}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <div
            className={`relative flex items-center border rounded-lg overflow-hidden transition-colors ${
              hasError('password')
                ? 'border-error'
                : 'border-border-light focus-within:border-primary'
            }`}
          >
            <HiLockClosed className="absolute left-3 text-text-muted text-xl" aria-hidden />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-11 pr-12 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              aria-invalid={hasError('password')}
              aria-describedby="pw-help"
              required
            />
            <button
              type="button"
              className="absolute right-3 text-text-muted hover:text-primary transition-colors"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보이기'}
            >
              {showPassword ? <HiEye className="text-xl" /> : <HiEyeOff className="text-xl" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="pw-help" className="mt-1 text-sm text-error">
              {errors.password}
            </p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isInvalid}
          className="w-full py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary-light transition-colors disabled:bg-text-muted disabled:cursor-not-allowed"
        >
          로그인
        </button>

        {/* 링크 */}
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/register"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            이메일 회원가입
          </Link>
          <Link
            to="/reset-password"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            비밀번호 재설정
          </Link>
        </div>
      </form>
    </div>
  );
}