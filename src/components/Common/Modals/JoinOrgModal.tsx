import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { joinOrganization } from "@/api/orgs/joinOrg";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

interface JoinOrgModalProps {
  onClose: () => void;
  refresh: () => void;
}

const JoinOrgModal: React.FC<JoinOrgModalProps> = ({ onClose, refresh }) => {
  const [joinCode, setJoinCode] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    color: "blue" | "red" | "green" | "yellow";
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  const handleJoin = async () => {
    try {
      if (!joinCode.trim()) {
        setConfirmModal({
          title: "입력 오류",
          message: "조직 코드를 입력해주세요.",
          color: "yellow",
          confirmText: "확인",
          onConfirm: () => setConfirmModal(null),
        });
        return;
      }

      const codeRegex = /^[A-Za-z0-9]{6}$/;
      if (!codeRegex.test(joinCode)) {
        setConfirmModal({
          title: "입력 오류",
          message: "조직 코드는 영어+숫자 6자리여야 합니다.\n\n예: F1SA24",
          color: "yellow",
          confirmText: "확인",
          onConfirm: () => setConfirmModal(null),
        });
        return;
      }

      const orgId = 1; // TODO: 실제 선택된 조직 ID 로직 적용
      const success = await joinOrganization(orgId, joinCode);

      if (success) {
        setConfirmModal({
          title: "가입 신청 완료",
          message: "✅ 가입 신청이 완료되었습니다.\n승인 대기 중입니다.",
          color: "green",
          confirmText: "확인",
          onConfirm: () => {
            setConfirmModal(null);
            refresh();
            onClose();
          },
        });
      }
    } catch (err: any) {
      setConfirmModal({
        title: "오류 발생",
        message: err.message || "조직 가입 중 오류가 발생했습니다.",
        color: "red",
        confirmText: "확인",
        onConfirm: () => setConfirmModal(null),
      });
    }
  };

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              조직 가입
            </h2>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <span className="font-semibold">💡 Tip:</span> 조직 관리자에게 받은
              <strong> 6자리 코드</strong>를 입력하세요.
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              조직 코드
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) =>
                setJoinCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))
              }
              placeholder="예: A12B3C"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {joinCode.length}/6 자리
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleJoin}
                disabled={joinCode.length !== 6}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                가입 신청
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ConfirmActionModal 렌더링 */}
      {confirmModal && (
        <ConfirmActionModal
          title={confirmModal.title}
          message={confirmModal.message}
          color={confirmModal.color}
          confirmText={confirmModal.confirmText}
          cancelText="취소"
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>
  );
};

export default JoinOrgModal;