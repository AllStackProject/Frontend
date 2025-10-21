import React, { useState } from "react";
import { Edit2, Lock } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);

  // 예시 데이터 (추후 API 연동 예정)
  const [user, setUser] = useState<UserInfo>({
    name: "홍길동",
    email: "honggildong@example.com",
    gender: "남성",
    ageGroup: "20대",
    phone: "01012345678",
    organizations: ["우리 FISA", "PASTA EDU"],
    avatar: "/user1.png",
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
  };

  const handleSave = () => {
    // 비밀번호 확인 검증
    if (formData.password && formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setUser({
      ...user,
      gender: formData.gender,
      ageGroup: formData.ageGroup,
      phone: formData.phone,
    });

    // TODO: 비밀번호가 입력되었으면 비밀번호 변경 API 호출
    if (formData.password) {
      console.log("비밀번호 변경:", formData.password);
    }

    setIsEditing(false);
    setFormData({
      ...formData,
      password: "",
      passwordConfirm: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
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
              <Lock size={16} className="text-text-muted" title="수정 불가" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-secondary">{user.email}</p>
              <Lock size={14} className="text-text-muted" title="수정 불가" />
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
                <Lock size={14} className="text-text-muted" title="수정 불가" />
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
            <h4 className="text-sm font-semibold text-text-primary">비밀번호 변경</h4>
            <InputField
              label="새 비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="변경하지 않으려면 비워두세요"
            />
            <InputField
              label="비밀번호 확인"
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              성별
            </label>
            <div className="flex gap-3">
              {["남성", "여성", "기타"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
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
          </div>

          {/* 연령대 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              연령대
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">선택해주세요</option>
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대 이상">50대 이상</option>
            </select>
          </div>

          {/* 전화번호 */}
          <InputField
            label="전화번호"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01012345678"
          />

          {/* 조직명 (읽기 전용) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-text-secondary">
                소속된 조직명
              </label>
              <Lock size={14} className="text-text-muted" title="수정 불가" />
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
    />
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