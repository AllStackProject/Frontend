import React, { useState } from "react";
import { X, AlertTriangle, UserX } from "lucide-react";

interface ConfirmRemoveUserModalProps {
  user: { name: string; email: string };
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmRemoveUserModal: React.FC<ConfirmRemoveUserModalProps> = ({
  user,
  onClose,
  onConfirm,
}) => {
  const [confirmInput, setConfirmInput] = useState("");

  const handleConfirm = () => {
    if (confirmInput === "내보내기") {
      onConfirm();
      setConfirmInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-red-50 border-red-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <UserX size={20} className="text-red-600" />
            사용자 내보내기
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
        <div className="p-6">
          {/* 경고 아이콘 및 메시지 */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                정말 내보내시겠습니까?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                이 작업은 되돌릴 수 없으며, 해당 사용자는 조직에서 즉시 제거됩니다.
              </p>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-600 mb-2">내보낼 사용자</p>
            <p className="font-semibold text-gray-800 mb-1">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          {/* 영향 안내 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-800 mb-2">
              <span className="font-semibold">내보내기 후 영향:</span>
            </p>
            <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
              <li>조직 접근 권한이 즉시 박탈됩니다</li>
              <li>다시 초대하려면 새로운 초대가 필요합니다</li>
            </ul>
          </div>

          {/* 확인 입력 */}
          <div>
            <p className="text-sm text-gray-700 mb-2">
              계속하려면 아래에 <span className="font-bold text-gray-800">"내보내기"</span>를 입력하세요.
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="내보내기"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirmInput !== "내보내기"}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              confirmInput === "내보내기"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            내보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemoveUserModal;