import React from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";

interface GroupItem {
  id: number;
  name: string;
}

interface ConfirmActionModalProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  action: "approve" | "reject";
  groups: GroupItem[];
  selectedGroups: number[];
  onToggleGroup: (id: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  user,
  action,
  groups,
  selectedGroups,
  onToggleGroup,
  onClose,
  onConfirm,
}) => {
  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div
          className={`flex justify-between items-center px-6 py-4 border-b ${
            isApprove ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
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
          <button onClick={onClose}>
            <X size={22} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            {isApprove
              ? "이 멤버를 승인하고 조직에 추가합니다."
              : "해당 멤버 가입 요청을 거절합니다. 거절한 멤버는 조직에 재가입 할 수 없습니다."}
          </p>

          {/* User info */}
          <div className="bg-gray-50 border p-4 rounded-lg mb-4 space-y-1">
            <p className="text-sm text-gray-700">
              <strong>이름:</strong> {user.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>닉네임:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>ID:</strong> {user.id}
            </p>
          </div>

          {/* 그룹 선택 (승인일 때만) */}
          {isApprove && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">그룹 선택</p>

              {groups.length === 0 ? (
                <p className="text-sm text-gray-500">등록된 그룹이 없습니다.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {groups.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(g.id)}
                        onChange={() => onToggleGroup(g.id)}
                      />
                      <span>{g.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2 border rounded-lg text-sm"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg text-sm text-white ${
              isApprove ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
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