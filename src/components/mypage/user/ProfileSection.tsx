import React, { useState, useEffect } from "react";
import { Edit2, Lock, AlertCircle, Eye, EyeOff, UserX } from "lucide-react";
import { getUserInfo, updateUserInfo, deleteUser } from "@/api/user/userInfo";
import type { UserInfoResponse } from "@/types/user";
import { useModal } from "@/context/ModalContext";

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

interface UserInfo {
  name: string;
  email: string;
  gender: string;
  ageGroup: string;
  phone: string;
  organizations: string[];
  avatar?: string;
}

const ProfileSection: React.FC = () => {
  const { openModal } = useModal();

  const [user, setUser] = useState<UserInfo>({
    name: "",
    email: "",
    gender: "",
    ageGroup: "",
    phone: "",
    organizations: [],
    avatar: "/user-icon/user1.png",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({
    gender: "",
    ageGroup: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfoData = async () => {
      try {
        const data: UserInfoResponse = await getUserInfo();

        const mappedGender = data.gender === "MALE" ? "남성" : "여성";
        const mappedAge =
          data.ages === 10
            ? "10대"
            : data.ages === 20
              ? "20대"
              : data.ages === 30
                ? "30대"
                : data.ages === 40
                  ? "40대"
                  : "50대 이상";

        setUser({
          name: data.name,
          email: data.email,
          gender: mappedGender,
          ageGroup: mappedAge,
          phone: data.phone_number,
          organizations: data.organizations,
          avatar: "/user-icon/user1.png",
        });

        setFormData({
          gender: mappedGender,
          ageGroup: mappedAge,
          phone: data.phone_number,
          password: "",
          passwordConfirm: "",
        });
      } catch (err: any) {
        openModal({
          type: "error",
          title: "정보 로드 실패",
          message: err.message || "사용자 정보를 불러오지 못했습니다.",
        });
      }
    };

    fetchUserInfoData();
  }, []);

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 폼 검증 (에러 필드 이름까지 반환)
  const validateForm = (): { isValid: boolean; firstErrorField?: string } => {
    const newErrors: Record<string, string> = {};

    if (!formData.gender) newErrors.gender = "성별을 선택해 주세요.";
    if (!formData.ageGroup) newErrors.ageGroup = "연령대를 선택해 주세요.";

    if (!formData.phone) {
      newErrors.phone = "전화번호를 입력해 주세요.";
    } else if (!phoneRe.test(formData.phone)) {
      newErrors.phone = "전화번호는 10~11자리 숫자로 입력해 주세요.";
    }

    if (formData.password) {
      if (!validatePassword(formData.password)) {
        newErrors.password =
          "영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8자 이상 입력해 주세요.";
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
      }
    }

    if (formData.passwordConfirm && !formData.password) {
      newErrors.password = "새 비밀번호를 입력해 주세요.";
    }

    setErrors(newErrors);

    const firstErrorField = Object.keys(newErrors)[0];
    return { isValid: Object.keys(newErrors).length === 0, firstErrorField };
  };

  // 수정 저장
  const handleSave = async () => {
    const { isValid, firstErrorField } = validateForm();

    if (!isValid) {
      if (firstErrorField) {
        const element = document.querySelector(
          `[name="${firstErrorField}"]`
        ) as HTMLElement | null;
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    try {
      const body: Record<string, any> = {
        changed_age: parseInt(formData.ageGroup.replace("대", "").trim(), 10),
        changed_gender: formData.gender === "남성" ? "MALE" : "FEMALE",
        changed_phone_num: formData.phone,
      };

      if (formData.password && formData.passwordConfirm) {
        body.new_password = formData.password;
        body.confirm_password = formData.passwordConfirm;
      }

      const isSuccess = await updateUserInfo(body);

      if (isSuccess) {
        setUser((prev) => ({
          ...prev,
          gender: formData.gender,
          ageGroup: formData.ageGroup,
          phone: formData.phone,
        }));
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          passwordConfirm: "",
        }));
        openModal({
          type: "success",
          title: "수정 완료",
          message: "사용자 정보가 성공적으로 수정되었습니다.",
          autoClose: true,
          autoCloseDelay: 2000,
        });
      } else {
        openModal({
          type: "error",
          title: "수정 실패",
          message: "사용자 정보 수정에 실패했습니다.",
        });
      }
    } catch (err: any) {
      console.error(err);
      openModal({
        type: "error",
        title: "오류 발생",
        message: err.message || "처리 중 오류가 발생했습니다.",
      });
    }
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

  // 탈퇴 성공 후 로그인 페이지로 이동
  const handleSuccessConfirm = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 회원 탈퇴 실행 (확인 모달에서 호출)
  const handleDeleteAccount = async () => {
    try {
      const success = await deleteUser();
      if (success) {
        openModal({
          type: "success",
          title: "회원 탈퇴 완료",
          message: "탈퇴가 성공적으로 처리되었습니다.\n로그인 페이지로 이동합니다.",
          confirmText: "확인",
          onConfirm: handleSuccessConfirm,
        });
      } else {
        openModal({
          type: "error",
          title: "오류 발생",
          message: "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    } catch (err: any) {
      openModal({
        type: "error",
        title: "오류 발생",
        message: err.message || "회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };


  return (
    <>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-base border border-border-light p-6">
        {/* 상단 프로필 */}
        <div className="flex items-center justify-between border-b border-border-light pb-5 mb-5">
          <div className="flex items-center gap-6">
            <img
              src={user.avatar}
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover shadow-sm"
            />
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-text-primary">
                  {user.name}
                </h2>
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
            {isEditing ? "수정 취소" : "수정"}
          </button>
        </div>

        {/* 보기 모드 */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow label="성별" value={user.gender} />
              <InfoRow label="연령대" value={user.ageGroup} />
              <InfoRow label="전화번호" value={user.phone} />
              <div className="sm:col-span-2  pb-3">
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

            {/* 회원 탈퇴 영역 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <UserX size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      회원 탈퇴
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                    <button
                      onClick={() => handleDeleteAccount()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
                    >
                      회원 탈퇴하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 수정 모드 */
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              정보 수정
            </h3>

            {/* 비밀번호 변경 */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-text-primary">
                  비밀번호 변경
                </h4>
                <span className="text-xs text-text-muted">(선택사항)</span>
              </div>

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

              <PasswordField
                label="비밀번호 확인"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="새 비밀번호를 다시 입력하세요"
                error={errors.passwordConfirm}
                showPassword={showPasswordConfirm}
                onTogglePassword={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
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
                    className={`flex-1 py-2 border rounded-lg transition ${formData.gender === g
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
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${errors.ageGroup ? "border-red-500" : "border-border-light"
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

            {/* 조직명 */}
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

            {/* 저장/취소 */}
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
    </>
  );
};

/* ===== 재사용 컴포넌트 ===== */

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
      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${error ? "border-red-500" : "border-border-light"
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
        className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-primary focus:outline-none ${error ? "border-red-500" : "border-border-light"
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
  <div
    className={`flex items-center gap-1.5 ${checked ? "text-green-600" : "text-text-secondary"
      }`}
  >
    <span className="font-medium">{checked ? "✓" : "○"}</span>
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