import React, { useState } from "react";
import { X, Shield, Info } from "lucide-react";
import ConfirmActionModal from "@/components/Common/Modals/ConfirmActionModal";

interface RoleSettingModalProps {
  user: { name: string; email: string; role: string };
  onClose: () => void;
  onSubmit: (newRole: string) => void;
}

const RoleSettingModal: React.FC<RoleSettingModalProps> = ({
  user,
  onClose,
  onSubmit,
}) => {
  const [role, setRole] = useState(user.role);
  const [permissions, setPermissions] = useState({
    manageVideos: true,
    manageQuiz: true,
    manageViewing: true,
    manageNotice: true,
    viewStats: true,
    manageOrganization: true,
    manageUsers: false, // 슈퍼관리자만
    viewPricing: false, // 슈퍼관리자만
  });

  // 확인 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 역할별 권한 설명
  const getRoleDescription = (roleName: string) => {
    switch (roleName) {
      case "슈퍼관리자":
        return "모든 권한을 가지며, 조직 설정 및 사용자 관리가 가능합니다.";
      case "관리자":
        return "콘텐츠 관리 및 일부 통계 조회 권한을 가집니다.";
      case "일반 사용자":
        return "기본적인 콘텐츠 조회 및 제한적인 기능만 사용 가능합니다.";
      default:
        return "";
    }
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    onSubmit(role);
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              권한 설정
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X size={22} />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* 사용자 정보 */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">권한을 변경할 사용자</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* 역할 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                역할 선택 <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="슈퍼관리자">슈퍼관리자</option>
                <option value="관리자">관리자</option>
                <option value="일반 사용자">일반 사용자</option>
              </select>

              {/* 역할 설명 */}
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex gap-2">
                <Info size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{getRoleDescription(role)}</p>
              </div>
            </div>

            {/* 세부 권한 설정 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                세부 권한 설정
              </label>
              
              {role === "일반 사용자" ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    일반 사용자는 세부 권한을 설정할 수 없습니다.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    관리자 또는 슈퍼관리자 권한이 필요합니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { 
                      key: "manageVideos", 
                      label: "동영상 관리", 
                      description: "동영상 업로드, 수정, 삭제 및 관리 권한",
                      adminOnly: false
                    },
                    { 
                      key: "manageQuiz", 
                      label: "AI 퀴즈 관리", 
                      description: "AI 퀴즈 생성, 수정, 삭제 및 관리 권한",
                      adminOnly: false
                    },
                    { 
                      key: "manageViewing", 
                      label: "시청 관리", 
                      description: "사용자 시청 기록 조회 및 분석 권한",
                      adminOnly: false
                    },
                    { 
                      key: "manageNotice", 
                      label: "공지 등록", 
                      description: "공지사항 작성, 수정, 삭제 권한",
                      adminOnly: false
                    },
                    { 
                      key: "viewStats", 
                      label: "통계/리포트", 
                      description: "조직 통계 및 리포트 조회 권한",
                      adminOnly: false
                    },
                    { 
                      key: "manageOrganization", 
                      label: "조직 설정", 
                      description: "조직 정보, 그룹, 해시태그 관리 권한",
                      adminOnly: false
                    },
                    { 
                      key: "manageUsers", 
                      label: "사용자 관리", 
                      description: "사용자 승인, 권한 설정 및 관리 (슈퍼관리자 전용)",
                      adminOnly: true
                    },
                    { 
                      key: "viewPricing", 
                      label: "요금제 광고", 
                      description: "요금제 정보 조회 (슈퍼관리자 전용)",
                      adminOnly: true
                    },
                  ].map((item) => {
                    const isDisabled = item.adminOnly && role !== "슈퍼관리자";
                    
                    return (
                      <label
                        key={item.key}
                        className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                          isDisabled
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            isDisabled 
                              ? false 
                              : permissions[item.key as keyof typeof permissions]
                          }
                          onChange={() => !isDisabled && togglePermission(item.key as keyof typeof permissions)}
                          disabled={isDisabled}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded disabled:cursor-not-allowed"
                        />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isDisabled ? "text-gray-500" : "text-gray-800"}`}>
                            {item.label}
                            {item.adminOnly && (
                              <span className="ml-2 text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                슈퍼관리자 전용
                              </span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDisabled ? "text-gray-400" : "text-gray-500"}`}>
                            {item.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 경고 메시지 */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-2">
                <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">주의:</span> 권한 변경 시 해당 사용자의 접근 권한이 즉시 적용됩니다.
                </p>
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSaveClick}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              권한 저장
            </button>
          </div>
        </div>
      </div>

      {/* 권한 저장 확인 모달 */}
      {showConfirmModal && (
        <ConfirmActionModal
          title="권한 저장"
          message={`"${user.name}"님의 권한을 "${role}"(으)로 변경하시겠습니까?\n권한 변경은 즉시 적용되며, 해당 사용자의 접근 권한이 변경됩니다.`}
          keyword="저장"
          confirmText="저장"
          color="blue"
          onConfirm={handleConfirmSave}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default RoleSettingModal;