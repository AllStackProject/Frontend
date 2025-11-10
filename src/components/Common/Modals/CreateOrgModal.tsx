import React, { useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import { createOrganization } from "@/api/orgs/createOrg";
import type { CreateOrgRequest } from "@/types/org";

interface CreateOrgModalProps {
  onClose: () => void;
  refresh: () => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({
  onClose,
  refresh,
}) => {
  const [newOrgData, setNewOrgData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    color: "blue" | "red" | "green" | "yellow";
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // 필수 항목 검증 함수
  const validateFields = () => {
    if (!newOrgData.name.trim()) {
      return "조직명을 입력해주세요.";
    }
    if (!newOrgData.logo.trim()) {
      return "조직 이미지를 업로드해주세요.";
    }
    if (!newOrgData.description.trim()) {
      return "조직 설명을 입력해주세요.";
    }
    return null;
  };

  const handleCreateOrganization = async () => {
    const errorMessage = validateFields();
    if (errorMessage) {
      setConfirmModal({
        title: "필수 입력",
        message: errorMessage,
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setConfirmModal(null),
      });
      return;
    }

    try {
      const payload: CreateOrgRequest = {
        name: newOrgData.name,
        img_url: newOrgData.logo,
        desc: newOrgData.description,
      };

      const result = await createOrganization(payload);

      setConfirmModal({
        title: "조직 생성 완료",
        message: `조직이 성공적으로 생성되었습니다. \n조직 코드: ${result.code}\n바로 조직 홈 화면으로 이동합니다.`,
        color: "green",
        confirmText: "확인",
        onConfirm: () => {
          setConfirmModal(null);
          refresh();
          onClose();
        },
      });
    } catch (err: any) {
      setConfirmModal({
        title: "생성 실패",
        message: err.message || "조직 생성 중 오류가 발생했습니다.",
        color: "red",
        confirmText: "닫기",
        onConfirm: () => setConfirmModal(null),
      });
    }
  };

  return createPortal(
    <>
      {/* ✅ 메인 모달 */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-text-primary">조직 생성</h3>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>

          {/* 본문 */}
          <div className="space-y-5">
            {/* 이름 + 중복 확인 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직명 *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOrgData.name}
                  onChange={(e) =>
                    setNewOrgData({ ...newOrgData, name: e.target.value })
                  }
                  placeholder="조직명을 입력하세요"
                  className="flex-1 border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!newOrgData.name.trim()) {
                      setConfirmModal({
                        title: "필수 입력",
                        message: "조직명을 입력해주세요.",
                        color: "yellow",
                        onConfirm: () => setConfirmModal(null),
                      });
                      return;
                    }
                  }}
                  className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직 이미지 *
              </label>
              <div className="flex items-center gap-3">
                {newOrgData.logo ? (
                  <img
                    src={newOrgData.logo}
                    alt="조직 이미지 미리보기"
                    className="w-16 h-16 rounded-lg object-cover border border-border-light"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-text-muted text-xs border border-border-light">
                    미리보기
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition">
                  이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewOrgData({
                            ...newOrgData,
                            logo: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직 설명 *
              </label>
              <textarea
                value={newOrgData.description}
                onChange={(e) =>
                  setNewOrgData({
                    ...newOrgData,
                    description: e.target.value,
                  })
                }
                placeholder="조직에 대한 설명을 입력하세요"
                rows={3}
                className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-xs text-success">
              ✅ 조직 생성 시 자동으로 슈퍼관리자 권한이 부여되며, 고유한 조직 코드가 발급됩니다.
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleCreateOrganization}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition"
            >
              생성하기
            </button>
          </div>
        </div>
      </div>

      {/* ✅ ConfirmActionModal 공통 알림 */}
      {confirmModal && (
        <ConfirmActionModal
          title={confirmModal.title}
          message={confirmModal.message}
          color={confirmModal.color}
          confirmText={confirmModal.confirmText}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>,
    document.body
  );
};

export default CreateOrgModal;