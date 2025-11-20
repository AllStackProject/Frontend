import React, { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  title?: string;
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title = "완료되었습니다!",
  message = "작업이 성공적으로 처리되었습니다.",
  autoClose = false,
  autoCloseDelay = 2000,
  onClose,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* 메시지 */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* 버튼 */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        >
          확인
        </button>

        {/* 자동 닫힘 표시 */}
        {autoClose && (
          <p className="text-xs text-gray-400 text-center mt-3">
            {autoCloseDelay / 1000}초 후 자동으로 닫힙니다
          </p>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;