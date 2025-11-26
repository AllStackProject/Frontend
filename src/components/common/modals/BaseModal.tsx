import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
} from "lucide-react";

type ModalType =
  | "confirm"       // 일반 확인/취소
  | "delete"        // 삭제 (삭제 입력)
  | "edit"          // 수정 (수정 입력)
  | "success"       // 성공 모달
  | "error";        // 실패 모달

interface BaseModalProps {
  type?: ModalType;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  requiredKeyword?: string;     // 삭제 or 수정 시 입력해야 하는 keyword
  autoClose?: boolean;
  autoCloseDelay?: number;
  onConfirm?: () => void;
  onClose: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({
  type = "confirm",
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  requiredKeyword,
  autoClose = false,
  autoCloseDelay = 2000,
  onConfirm,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const isDisabled = !!requiredKeyword && input !== requiredKeyword;

  // 자동 닫힘 옵션
  useEffect(() => {
    if (type === "success" && autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [type, autoClose, autoCloseDelay, onClose]);

  // 모달 타입별 아이콘 + 색상
  const config = {
    confirm: {
      icon: <AlertTriangle size={40} className="text-blue-500" />,
    },
    delete: {
      icon: <Trash2 size={40} className="text-red-500" />,
    },
    edit: {
      icon: <AlertTriangle size={40} className="text-blue-500" />,
    },
    success: {
      icon: (
        <CheckCircle2 size={40} className="text-green-500" />
      ),
    },
    error: {
      icon: <AlertTriangle size={40} className="text-red-500" />,
    },
  };

  const disabled =
    requiredKeyword && input !== requiredKeyword;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center relative">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          {config[type].icon}
        </div>

        {/* TITLE */}
        {title && (
          <h3 className="text-lg font-bold mb-2">{title}</h3>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="text-sm text-gray-600 whitespace-pre-line mb-5">
            {message}
          </p>
        )}

        {/* REQUIRED KEYWORD */}
        {requiredKeyword && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${requiredKeyword}`}
            className="w-full border rounded-lg px-3 py-2 italic text-center mb-5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}

        {/* BUTTONS */}
        {type !== "success" && type !== "error" ? (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border hover:bg-gray-100"
            >
              {cancelText}
            </button>
            <button
              disabled={isDisabled}
              onClick={onConfirm}
              className={`flex-1 py-2 rounded-lg text-white font-semibold transition ${
                disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            확인
          </button>
        )}

        {/* SUCCESS AUTO CLOSE 안내 */}
        {type === "success" && autoClose && (
          <p className="text-xs text-gray-400 mt-3">
            {autoCloseDelay / 1000}초 후 자동으로 닫힙니다
          </p>
        )}
      </div>
    </div>
  );
};

export default BaseModal;