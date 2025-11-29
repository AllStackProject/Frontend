import { useState } from 'react';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/user/login';
import type { LoginRequest } from '@/types/auth';

type Errors = { email?: string; password?: string; general?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState<LoginRequest>({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

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

  const hasError = (k: keyof Errors) => !!errors[k] && !!touched[k as keyof typeof touched];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const eMap = validate();
  setErrors(eMap);
  setTouched({ email: true, password: true });

  if (Object.keys(eMap).length > 0) return;

  setLoading(true);
  setErrors({});

  try {
    const res = await login(values);

    if (res.is_success) {
      navigate('/login/select');
    } else {
      setErrors({ general: '이메일 또는 비밀번호를 확인해주세요.' });
    }
  } catch (err: any) {
    setErrors({ general: err.message || '로그인 중 오류가 발생했습니다.' });
  } finally {
    
  }
};

  const isInvalid = Object.keys(validate()).length > 0 || loading;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 로고 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Privideo</h1>
        <p className="text-text-secondary text-sm">간편하게 공유하는 “우리”만의 영상 공간</p>
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* 이메일 입력 */}
        <div>
          <div
            className={`relative flex items-center border rounded-lg overflow-hidden transition-colors ${hasError('email')
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
            className={`relative flex items-center border rounded-lg overflow-hidden transition-colors ${hasError('password')
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

        {/* 공통 에러 메시지 */}
        {errors.general && (
          <p className="text-center text-sm text-error mt-2">{errors.general}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isInvalid}
          className="w-full py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary-light transition-colors disabled:bg-text-muted disabled:cursor-not-allowed"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {/* 링크 */}
        <div className="flex items-center justify-between text-sm">
          <Link
            to="/register"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            회원가입
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