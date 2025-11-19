import React from "react";
import { X, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ConfirmActionModalProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: "approve" | "reject";
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  user,
  action,
  onClose,
  onConfirm,
}) => {
  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className={`flex justify-between items-center px-6 py-4 border-b ${
          isApprove ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {isApprove ? (
              <>
                <CheckCircle2 size={20} className="text-green-600" />
                가입 승인
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-600" />
                가입 거절
              </>
            )}
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
          <div className="flex items-start gap-3 mb-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isApprove ? "bg-green-100" : "bg-red-100"
            }`}>
              {isApprove ? (
                <CheckCircle2 size={24} className="text-green-600" />
              ) : (
                <AlertTriangle size={24} className="text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                {isApprove ? "가입을 승인하시겠습니까?" : "가입을 거절하시겠습니까?"}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {isApprove
                  ? "승인 시 해당 사용자는 조직에 가입되어 서비스를 이용할 수 있습니다."
                  : "거절 시 해당 사용자의 가입 요청이 취소됩니다."}
              </p>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">이름:</span>
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">이메일:</span>
              <span className="text-sm font-medium text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">사용자 ID:</span>
              <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-700">
                {user.id}
              </span>
            </div>
          </div>

          {/* 추가 안내 */}
          {isApprove && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">안내:</span> 승인 후 사용자는 <span className="font-semibold">'일반 사용자'</span> 권한으로 가입됩니다. 권한 변경은 사용자 목록에서 가능합니다.
              </p>
            </div>
          )}
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
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              isApprove
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isApprove ? "승인" : "거절"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;