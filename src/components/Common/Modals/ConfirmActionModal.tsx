import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmActionModalProps {
  title?: string;
  message: string;
  keyword?: string;
  confirmText?: string;
  cancelText?: string;
  color?: "blue" | "red" | "green" | "yellow";
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  title = "확인이 필요합니다",
  message,
  keyword,
  confirmText = "확인",
  cancelText = "취소",
  color = "blue",
  onConfirm,
  onClose,
}) => {
  const [input, setInput] = useState("");

  const colorStyles = {
    blue: {
      icon: "text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      input: "focus:ring-blue-500 focus:border-blue-500",
    },
    red: {
      icon: "text-red-500",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      input: "focus:ring-red-500 focus:border-red-500",
    },
    green: {
      icon: "text-green-500",
      button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      input: "focus:ring-green-500 focus:border-green-500",
    },
    yellow: {
      icon: "text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      input: "focus:ring-yellow-500 focus:border-yellow-500",
    },
  };

  const styles = colorStyles[color];
  const isDisabled = keyword ? input !== keyword : false;

  const handleConfirm = () => {
    if (!isDisabled) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertTriangle size={32} className={styles.icon} />
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* 메시지 */}
        <p className="text-sm text-gray-600 text-center mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* 키워드 입력 */}
        {keyword && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              확인하려면 <span className="font-bold text-gray-900">"{keyword}"</span>를 입력하세요
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={keyword}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm focus:outline-none focus:ring-2 ${styles.input}`}
              autoFocus
            />
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDisabled}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-white transition ${styles.button} ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;