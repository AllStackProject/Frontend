import React, { useState } from "react";
import { X, UploadCloud, RefreshCcw, Building2, AlertTriangle } from "lucide-react";
import ConfirmActionModal from "@/components/Common/Modals/ConfirmActionModal";

interface OrganizationInfo {
  id: string;
  name: string;
  image?: string;
  members: number;
  inviteCode: string;
  hashtags: string[];
  groups: string[];
}

interface EditOrganizationModalProps {
  organization: OrganizationInfo;
  onClose: () => void;
  onSubmit: (updated: OrganizationInfo) => void;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  organization,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(organization);
  
  // 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 랜덤 6자리 숫자 생성 함수
  const handleRegenerateClick = () => {
    setShowRegenerateConfirm(true);
  };

  const generateNewCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setForm((prev) => ({ ...prev, inviteCode: randomCode }));
    setShowRegenerateConfirm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("이미지 파일 크기는 5MB 이하여야 합니다.");
        setShowErrorModal(true);
        return;
      }
      const preview = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: preview }));
    }
  };

  const handleSave = () => {
    setShowSaveConfirm(true);
  };

  const confirmSave = () => {
    onSubmit(form);
    setShowSaveConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              조직 정보 수정
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
            <div className="space-y-5">
              {/* 조직 이미지 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  조직 이미지
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={form.image || "/default-organization.png"}
                      alt="조직 이미지"
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Building2 size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="cursor-pointer flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                      <UploadCloud size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">
                        이미지 변경
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      권장 크기: 500x500px, 최대 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* 조직 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  조직 이름
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">
                  조직 이름은 변경할 수 없습니다.
                </p>
              </div>

              {/* 조직 정보 */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">조직 ID</p>
                    <p className="font-mono text-gray-800 font-medium">{form.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">구성원 수</p>
                    <p className="font-semibold text-blue-600">
                      {form.members.toLocaleString()}명
                    </p>
                  </div>
                </div>
              </div>

              {/* 조직 코드 (초대 코드) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  조직 초대 코드
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.inviteCode}
                    disabled
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100 font-mono text-gray-700 font-semibold tracking-wider"
                  />
                  <button
                    onClick={handleRegenerateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <RefreshCcw size={16} />
                    재생성
                  </button>
                </div>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>
                      조직 코드를 재생성하면 기존 초대 코드는 즉시 무효화됩니다.
                      새로운 코드로 초대해야 합니다.
                    </span>
                  </p>
                </div>
              </div>

              {/* 해시태그 및 그룹 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    해시태그
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {form.hashtags.length}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">개 등록됨</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    그룹
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {form.groups.length}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">개 등록됨</p>
                </div>
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
              onClick={handleSave}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              수정 저장
            </button>
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="입력 오류"
          message={errorMessage}
          confirmText="확인"
          color="red"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {/* 코드 재생성 확인 모달 */}
      {showRegenerateConfirm && (
        <ConfirmActionModal
          title="초대 코드 재생성"
          message="조직 코드를 재생성하시겠습니까?\n기존 초대 코드는 즉시 무효화됩니다."
          keyword="재생성"
          confirmText="재생성"
          color="blue"
          onConfirm={generateNewCode}
          onClose={() => setShowRegenerateConfirm(false)}
        />
      )}

      {/* 수정 확인 모달 */}
      {showSaveConfirm && (
        <ConfirmActionModal
          title="조직 정보 수정"
          message="조직 정보를 수정하시겠습니까?\n변경된 내용이 저장됩니다."
          keyword="수정"
          confirmText="수정"
          color="blue"
          onConfirm={confirmSave}
          onClose={() => setShowSaveConfirm(false)}
        />
      )}
    </>
  );
};

export default EditOrganizationModal;