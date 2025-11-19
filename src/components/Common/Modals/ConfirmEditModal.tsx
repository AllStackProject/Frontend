import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmEditModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmEditModal: React.FC<ConfirmEditModalProps> = ({ onConfirm, onClose }) => {
  const [input, setInput] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <AlertTriangle size={40} className="text-blue-500 mx-auto mb-3" />
        <p className="text-gray-800 font-medium mb-2">
          정말 수정하시겠습니까?
          <br />
          수정한 내용은 되돌릴 수 없습니다.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          수정하려면 아래 입력창에 <b>"수정"</b>을 입력하세요.
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="수정"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center mb-5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== "수정"}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              input === "수정"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEditModal;