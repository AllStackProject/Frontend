import React, { useState } from "react";
import { X, Edit3, AlertTriangle } from "lucide-react";
import type { VideoQuiz, Quiz } from "@/types/AdminQuiz";

interface Props {
  video: VideoQuiz;
  onClose: () => void;
  onSave: (updated: VideoQuiz) => void;
}

const EditQuizModal: React.FC<Props> = ({ video, onClose, onSave }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(video.quizzes);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleUpdateQuestion = (id: number, newText: string) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: newText } : q))
    );
  };

  const handleToggleAnswer = (id: number) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, answer: q.answer === "O" ? "X" : "O" } : q
      )
    );
  };

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    if (confirmInput === "수정") {
      onSave({ ...video, quizzes });
      setShowConfirmModal(false);
      setConfirmInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Edit3 size={20} className="text-blue-600" />
            {video.title} - AI 퀴즈 수정
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
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {quizzes.map((q, index) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      문항 {q.id}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleAnswer(q.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      q.answer === "O"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    정답: {q.answer}
                  </button>
                </div>
                <textarea
                  value={q.question}
                  onChange={(e) => handleUpdateQuestion(q.id, e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  placeholder="퀴즈 질문을 입력하세요"
                />
              </div>
            ))}
          </div>

          {quizzes.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              퀴즈가 없습니다.
            </div>
          )}
        </div>

        {/* 하단 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            수정 저장
          </button>
        </div>
      </div>

      {/* 수정 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center mx-4">
            <AlertTriangle size={48} className="text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              정말 수정하시겠습니까?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              수정한 내용은 되돌릴 수 없습니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              수정하려면 아래 입력창에 <span className="font-bold text-gray-800">"수정"</span>을 입력하세요.
            </p>

            {/* 입력 필드 */}
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="수정"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmInput("");
                }}
                className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmSave}
                disabled={confirmInput !== "수정"}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  confirmInput === "수정"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditQuizModal;