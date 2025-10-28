import React, { useState } from "react";
import { Edit2, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

interface UserInfo {
  name: string;
  email: string;
  gender: string;
  ageGroup: string;
  phone: string;
  organizations: string[];
  avatar?: string;
}

// 전화번호 정규식
const phoneRe = /^[0-9]{10,11}$/;

// 비밀번호 정책: 영문, 숫자, 특수문자 중 2종류 이상 조합 + 8자 이상
const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  return typeCount >= 2;
};

// 비밀번호 조건 체크
const getPasswordChecks = (password: string) => {
  return {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const ProfileSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 예시 데이터 (추후 API 연동 예정)
  const [user, setUser] = useState<UserInfo>({
    name: "홍길동",
    email: "honggildong@example.com",
    gender: "남성",
    ageGroup: "20대",
    phone: "01012345678",
    organizations: ["우리 FISA", "PASTA EDU"],
    avatar: "/user-icon/user1.png",
  });

  const [formData, setFormData] = useState({
    gender: user.gender,
    ageGroup: user.ageGroup,
    phone: user.phone,
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해 주세요.";
    }

    // 연령대 검증
    if (!formData.ageGroup) {
      newErrors.ageGroup = "연령대를 선택해 주세요.";
    }

    // 전화번호 검증
    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해 주세요.";
    } else if (!phoneRe.test(formData.phone)) {
      newErrors.phone = "전화번호는 10~11자리 숫자로 입력해 주세요.";
    }

    // 비밀번호 검증 (입력된 경우만)
    if (formData.password) {
      if (!validatePassword(formData.password)) {
        newErrors.password = "영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8자 이상 입력해 주세요.";
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
      }
    }

    // 비밀번호 확인이 입력되었는데 비밀번호가 없는 경우
    if (formData.passwordConfirm && !formData.password) {
      newErrors.password = "새 비밀번호를 입력해 주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    // 검증 수행
    if (!validateForm()) {
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 사용자 정보 업데이트
    setUser({
      ...user,
      gender: formData.gender,
      ageGroup: formData.ageGroup,
      phone: formData.phone,
    });

    // TODO: 비밀번호가 입력되었으면 비밀번호 변경 API 호출
    if (formData.password) {
      console.log("비밀번호 변경:", formData.password);
      // API 호출: await api.updatePassword({ password: formData.password });
    }

    // TODO: 사용자 정보 변경 API 호출
    console.log("사용자 정보 변경:", {
      gender: formData.gender,
      ageGroup: formData.ageGroup,
      phone: formData.phone,
    });

    setIsEditing(false);
    setErrors({});
    setFormData({
      ...formData,
      password: "",
      passwordConfirm: "",
    });

    alert("정보가 성공적으로 수정되었습니다.");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      gender: user.gender,
      ageGroup: user.ageGroup,
      phone: user.phone,
      password: "",
      passwordConfirm: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-base border border-border-light p-6">
      {/* 상단 프로필 영역 */}
      <div className="flex items-center justify-between border-b border-border-light pb-5 mb-5">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar}
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full object-cover shadow-sm"
          />
          
          {/* 수정 불가능한 정보 */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-text-primary">{user.name}</h2>
              <Lock size={16} className="text-text-muted" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{user.email}</p>
              <Lock size={14} className="text-text-muted" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          <Edit2 size={16} />
          {isEditing ? "수정 취소" : "정보 수정"}
        </button>
      </div>

      {/* 보기 모드 */}
      {!isEditing ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">계정 정보</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoRow label="성별" value={user.gender} />
            <InfoRow label="연령대" value={user.ageGroup} />
            <InfoRow label="전화번호" value={user.phone} />

            {/* 여러 조직을 표시 */}
            <div className="sm:col-span-2 border-b border-border-light pb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-text-secondary">소속된 조직명</span>
                <Lock size={14} className="text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-2">
                {user.organizations.map((org, i) => (
                  <span
                    key={i}
                    className="text-sm font-medium text-bg-page bg-primary-light px-3 py-1 rounded-full"
                  >
                    {org}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 수정 모드 */
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-text-primary mb-2">정보 수정</h3>

          {/* 비밀번호 변경 */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">비밀번호 변경</h4>
              <span className="text-xs text-text-muted">(선택사항)</span>
            </div>
            
            {/* 새 비밀번호 */}
            <PasswordField
              label="새 비밀번호"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="변경하지 않으려면 비워두세요"
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            
            {/* 비밀번호 강도 체크 */}
            {formData.password && (
              <div className="text-xs space-y-1.5 pl-1">
                <PasswordCheckItem
                  checked={getPasswordChecks(formData.password).length}
                  label="8자 이상"
                />
                <PasswordCheckItem
                  checked={
                    [
                      getPasswordChecks(formData.password).hasLetter,
                      getPasswordChecks(formData.password).hasNumber,
                      getPasswordChecks(formData.password).hasSpecial,
                    ].filter(Boolean).length >= 2
                  }
                  label="영문, 숫자, 특수문자 중 2종류 이상 조합"
                />
              </div>
            )}
            
            {/* 비밀번호 확인 */}
            <PasswordField
              label="비밀번호 확인"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
              error={errors.passwordConfirm}
              showPassword={showPasswordConfirm}
              onTogglePassword={() => setShowPasswordConfirm(!showPasswordConfirm)}
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              성별 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {["남성", "여성"].map((g) => (
                <button
                  key={g}
                  type="button"
                  name="gender"
                  onClick={() => {
                    setFormData({ ...formData, gender: g });
                    if (errors.gender) {
                      setErrors({ ...errors, gender: "" });
                    }
                  }}
                  className={`flex-1 py-2 border rounded-lg transition ${
                    formData.gender === g
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-primary border-border-light hover:bg-gray-50"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{errors.gender}</span>
              </div>
            )}
          </div>

          {/* 연령대 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              연령대 <span className="text-red-500">*</span>
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                errors.ageGroup ? 'border-red-500' : 'border-border-light'
              }`}
            >
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대 이상">50대 이상</option>
            </select>
            {errors.ageGroup && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{errors.ageGroup}</span>
              </div>
            )}
          </div>

          {/* 전화번호 */}
          <InputField
            label="전화번호"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01012345678"
            required
            error={errors.phone}
          />

          {/* 조직명 (읽기 전용) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-text-secondary">
                소속된 조직명
              </label>
              <Lock size={14} className="text-text-muted" />
            </div>
            <div className="flex flex-wrap gap-2">
              {user.organizations.map((org, i) => (
                <span
                  key={i}
                  className="text-sm font-medium text-bg-page bg-primary-light px-3 py-1 rounded-full border border-border-light"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-6 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg border border-border-light text-text-primary font-semibold hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition"
            >
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* 재사용 InputField */
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${
        error ? 'border-red-500' : 'border-border-light'
      }`}
    />
    {error && (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    )}
  </div>
);

/* 비밀번호 입력 필드 (눈 아이콘 포함) */
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  showPassword,
  onTogglePassword,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary focus:outline-none ${
          error ? 'border-red-500' : 'border-border-light'
        }`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
        <AlertCircle size={12} />
        <span>{error}</span>
      </div>
    )}
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
  <div className={`flex items-center gap-1.5 ${checked ? 'text-green-600' : 'text-text-secondary'}`}>
    <span className="font-medium">{checked ? '✓' : '○'}</span>
    <span>{label}</span>
  </div>
);

/* 보기 모드용 InfoRow */
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex justify-between items-center border-b border-border-light pb-2">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className="text-sm font-medium text-text-primary">{value}</span>
  </div>
);

export default ProfileSection;