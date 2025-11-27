import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { removeOrgMember } from "@/api/adminSuper/members";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

interface ConfirmRemoveUserModalProps {
  user: { id: number; name: string; email: string; role: string };
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmRemoveUserModal: React.FC<ConfirmRemoveUserModalProps> = ({
  user,
  onClose,
  onConfirm,
}) => {
  const { orgId } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const { openModal } = useModal();
  const [removing, setRemoving] = useState(false);

  const isConfirmValid = confirmText === "내보내기";

  const handleConfirm = async () => {
    if (!isConfirmValid || !orgId) return;

    try {
      setRemoving(true);

      // API 호출
      const success = await removeOrgMember(orgId, user.id);

      if (success) {
        openModal({
          type: "confirm",
          title: "멤버 내보내기 성공",
          message: "멤버가 성공적으로 내보내졌습니다. ",
        });
        onConfirm(); // 부모 컴포넌트에 성공 알림
        onClose();
      } else {
        openModal({
          type: "error",
          title: "멤버 내보내기 오류",
          message: "멤버 내보내기에 실패했습니다.",
        });
      }
    } catch (error: any) {
      openModal({
          type: "error",
          title: "멤버 내보내기 오류",
          message: error.message || "멤버 내보내기 중 오류가 발생했습니다.",
        });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            멤버 내보내기
          </h2>
          <button
            onClick={onClose}
            disabled={removing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="닫기"
          >
            <X size={22} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4">
          {/* 경고 메시지 */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-semibold mb-2">
              ⚠️ 이 작업은 되돌릴 수 없습니다
            </p>
            <p className="text-xs text-red-700">
              멤버를 조직에서 내보내면 해당 멤버는 더 이상 조직의 콘텐츠와 데이터에 접근할 수 없습니다.
            </p>
          </div>

          {/* 멤버 정보 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">이름</span>
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">닉네임</span>
              <span className="text-sm font-semibold text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">권한</span>
              <span className="text-sm font-semibold text-gray-800">{user.role}</span>
            </div>
          </div>

          {/* 확인 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              확인을 위해 "<span className="text-red-600">내보내기</span>"를 입력하세요
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="내보내기"
              disabled={removing}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={removing}
            className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmValid || removing}
            className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removing ? "처리 중..." : "내보내기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveUserModal;