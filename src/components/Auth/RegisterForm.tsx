import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

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

// 비밀번호 조건 체크
const getPasswordChecks = (password: string) => {
  return {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  values,
  onChange,
  onBlur,
  errors,
  touched,
  hasError,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      {/* 이름 */}
      <InputField
        label="이름"
        name="name"
        value={values.name}
        onChange={(e) => onChange("name", e.target.value)}
        onBlur={() => onBlur("name")}
        placeholder="홍길동"
        required
        error={hasError("name") ? errors.name : undefined}
      />

      {/* 성별 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          성별 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          {["남성", "여성"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange("gender", g)}
              onBlur={() => onBlur("gender")}
              className={`flex-1 py-2.5 border rounded-lg font-medium transition ${
                values.gender === g
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-primary border-border-light hover:bg-gray-50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        {hasError("gender") && (
          <ErrorMessage message={errors.gender} />
        )}
      </div>

      {/* 연령대 */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          연령대 <span className="text-red-500">*</span>
        </label>
        <select
          name="age"
          value={values.age}
          onChange={(e) => onChange("age", e.target.value)}
          onBlur={() => onBlur("age")}
          className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:outline-none ${
            hasError("age") ? 'border-red-500' : 'border-border-light'
          }`}
        >
          <option value="">선택해주세요</option>
          <option value="10대">10대</option>
          <option value="20대">20대</option>
          <option value="30대">30대</option>
          <option value="40대">40대</option>
          <option value="50대 이상">50대 이상</option>
        </select>
        {hasError("age") && (
          <ErrorMessage message={errors.age} />
        )}
      </div>

      {/* 전화번호 */}
      <InputField
        label="전화번호"
        name="phone"
        value={values.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        onBlur={() => onBlur("phone")}
        placeholder="01012345678"
        required
        error={hasError("phone") ? errors.phone : undefined}
        helperText="'-' 없이 숫자만 입력해주세요"
      />

      {/* 이메일 */}
      <InputField
        label="이메일"
        name="email"
        type="email"
        value={values.email}
        onChange={(e) => onChange("email", e.target.value)}
        onBlur={() => onBlur("email")}
        placeholder="example@email.com"
        required
        error={hasError("email") ? errors.email : undefined}
      />

      {/* 비밀번호 */}
      <div>
        <PasswordField
          label="비밀번호"
          name="password"
          value={values.password}
          onChange={(e) => onChange("password", e.target.value)}
          onBlur={() => onBlur("password")}
          placeholder="비밀번호를 입력하세요"
          required
          error={hasError("password") ? errors.password : undefined}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        
        {/* 비밀번호 강도 체크 */}
        {values.password && (
          <div className="mt-2 text-xs space-y-1.5 pl-1">
            <PasswordCheckItem
              checked={getPasswordChecks(values.password).length}
              label="8자 이상"
            />
            <PasswordCheckItem
              checked={
                [
                  getPasswordChecks(values.password).hasLetter,
                  getPasswordChecks(values.password).hasNumber,
                  getPasswordChecks(values.password).hasSpecial,
                ].filter(Boolean).length >= 2
              }
              label="영문, 숫자, 특수문자 중 2종류 이상"
            />
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <PasswordField
        label="비밀번호 확인"
        name="confirm"
        value={values.confirm}
        onChange={(e) => onChange("confirm", e.target.value)}
        onBlur={() => onBlur("confirm")}
        placeholder="비밀번호를 다시 입력하세요"
        required
        error={hasError("confirm") ? errors.confirm : undefined}
        showPassword={showConfirm}
        onTogglePassword={() => setShowConfirm(!showConfirm)}
      />

      {/* 조직코드 (선택) */}
      <InputField
        label="조직코드"
        name="organizationCode"
        value={values.organizationCode}
        onChange={(e) => onChange("organizationCode", e.target.value)}
        onBlur={() => onBlur("organizationCode")}
        placeholder="조직코드를 입력하세요 (선택사항)"
        helperText="조직코드가 있으면 입력해주세요"
      />
    </div>
  );
};

/* 일반 입력 필드 */
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  helperText,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
        error ? "border-red-500" : "border-border-light"
      }`}
    />
    {helperText && !error && (
      <p className="mt-1 text-xs text-text-muted">{helperText}</p>
    )}
    {error && <ErrorMessage message={error} />}
  </div>
);

/* 비밀번호 입력 필드 (눈 아이콘 포함) */
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  showPassword,
  onTogglePassword,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition ${
          error ? "border-red-500" : "border-border-light"
        }`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {error && <ErrorMessage message={error} />}
  </div>
);

/* 비밀번호 체크 항목 */
const PasswordCheckItem = ({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) => (
  <div className={`flex items-center gap-1.5 transition-colors ${
    checked ? 'text-green-600 font-medium' : 'text-text-secondary'
  }`}>
    <span className="text-base">{checked ? '✓' : '○'}</span>
    <span>{label}</span>
  </div>
);

/* 에러 메시지 */
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs">
    <AlertCircle size={12} />
    <span>{message}</span>
  </div>
);

export default RegisterForm;