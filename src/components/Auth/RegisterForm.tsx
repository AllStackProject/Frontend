// src/components/Auth/RegisterForm.tsx
import { useState } from 'react';
import { HiUser, HiPhone, HiMail, HiLockClosed, HiEye, HiEyeOff, HiOfficeBuilding } from 'react-icons/hi';

interface RegisterFormProps {
  values: {
    name: string;
    gender: string;
    age: string;
    phone: string;
    email: string;
    password: string;
    confirm: string;
    organizationCode: string;
  };
  onChange: (key: string, value: any) => void;
  onBlur: (key: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  hasError: (key: string) => boolean;
}

export default function RegisterForm({
  values,
  onChange,
  onBlur,
  errors,
  touched,
  hasError,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          이름 <span className="text-error">*</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            hasError('name') ? 'border-error' : 'border-border-light focus-within:border-primary'
          }`}
        >
          <HiUser className="ml-3 text-text-muted text-xl" />
          <input
            type="text"
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="이름을 입력해 주세요"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            onBlur={() => onBlur('name')}
          />
        </div>
        {hasError('name') && <p className="mt-1 text-sm text-error">{errors.name}</p>}
      </div>

      {/* 성별 (필수) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          성별 <span className="text-error">*</span>
        </label>
        <div className="flex gap-3">
          {['male', 'female'].map((gender) => (
            <label
              key={gender}
              className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                values.gender === gender
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border-light hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={values.gender === gender}
                onChange={(e) => onChange('gender', e.target.value)}
                onBlur={() => onBlur('gender')}
                className="sr-only"
              />
              <span className="font-medium">
                {gender === 'male' ? '남성' : '여성'}
              </span>
            </label>
          ))}
        </div>
        {hasError('gender') && <p className="mt-1 text-sm text-error">{errors.gender}</p>}
      </div>

      {/* 연령대 (필수) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          연령대 <span className="text-error">*</span>
        </label>
        <select
          value={values.age}
          onChange={(e) => onChange('age', e.target.value)}
          onBlur={() => onBlur('age')}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
            hasError('age') ? 'border-error' : 'border-border-light focus:border-primary'
          }`}
        >
          <option value="">연령대를 선택해주세요</option>
          <option value="10s">10대</option>
          <option value="20s">20대</option>
          <option value="30s">30대</option>
          <option value="40s">40대</option>
          <option value="50s">50대</option>
          <option value="60+">60대 이상</option>
        </select>
        {hasError('age') && <p className="mt-1 text-sm text-error">{errors.age}</p>}
      </div>

      {/* 전화번호 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          전화번호 <span className="text-error">*</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            hasError('phone') ? 'border-error' : 'border-border-light focus-within:border-primary'
          }`}
        >
          <HiPhone className="ml-3 text-text-muted text-xl" />
          <input
            type="tel"
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="01012345678"
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
          />
        </div>
        {hasError('phone') && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
      </div>

      {/* 이메일 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          이메일 <span className="text-error">*</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            hasError('email') ? 'border-error' : 'border-border-light focus-within:border-primary'
          }`}
        >
          <HiMail className="ml-3 text-text-muted text-xl" />
          <input
            type="email"
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
          />
        </div>
        {hasError('email') && <p className="mt-1 text-sm text-error">{errors.email}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          비밀번호 <span className="text-error">*</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            hasError('password') ? 'border-error' : 'border-border-light focus-within:border-primary'
          }`}
        >
          <HiLockClosed className="ml-3 text-text-muted text-xl" />
          <input
            type={showPassword ? 'text' : 'password'}
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="비밀번호 (8자 이상)"
            value={values.password}
            onChange={(e) => onChange('password', e.target.value)}
            onBlur={() => onBlur('password')}
          />
          <button
            type="button"
            className="px-3 text-text-muted hover:text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <HiEye className="text-xl" /> : <HiEyeOff className="text-xl" />}
          </button>
        </div>
        {hasError('password') && <p className="mt-1 text-sm text-error">{errors.password}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          비밀번호 확인 <span className="text-error">*</span>
        </label>
        <div
          className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
            hasError('confirm') ? 'border-error' : 'border-border-light focus-within:border-primary'
          }`}
        >
          <HiLockClosed className="ml-3 text-text-muted text-xl" />
          <input
            type={showConfirm ? 'text' : 'password'}
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="비밀번호 재입력"
            value={values.confirm}
            onChange={(e) => onChange('confirm', e.target.value)}
            onBlur={() => onBlur('confirm')}
          />
          <button
            type="button"
            className="px-3 text-text-muted hover:text-primary transition-colors"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <HiEye className="text-xl" /> : <HiEyeOff className="text-xl" />}
          </button>
        </div>
        {hasError('confirm') && <p className="mt-1 text-sm text-error">{errors.confirm}</p>}
      </div>

      {/* 조직 코드 (선택) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          조직 코드 <span className="text-text-muted text-xs">(선택)</span>
        </label>
        <div className="flex items-center border border-border-light rounded-lg overflow-hidden focus-within:border-primary transition-colors">
          <HiOfficeBuilding className="ml-3 text-text-muted text-xl" />
          <input
            type="text"
            className="flex-1 px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none"
            placeholder="조직 코드를 입력해 주세요"
            value={values.organizationCode}
            onChange={(e) => onChange('organizationCode', e.target.value)}
          />
        </div>
        <p className="mt-1 text-xs text-text-muted">
          조직에 소속되어 있다면 조직 코드를 입력해주세요
        </p>
      </div>
    </div>
  );
}