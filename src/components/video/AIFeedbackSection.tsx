import React from "react";
import { MessageSquareText } from "lucide-react";

export interface AIFeedbackSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  feedback: string;
}

const AIFeedbackSection: React.FC<AIFeedbackSectionProps> = ({
  isOpen,
  onToggle,
  feedback,
}) => {
  return (
    <div className="bg-bg-card border border-border-light rounded-xl shadow-base overflow-hidden">
      {/* 헤더 */}
      <div
        onClick={onToggle}
        className="flex justify-between items-center px-6 py-4 border-b border-border-light hover:bg-border-strong cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <MessageSquareText className="text-primary" size={22} />
          <h3 className="text-lg font-semibold text-text-primary">AI 피드백</h3>
        </div>
        <button className="text-text-link text-lg hover:scale-110 transition-transform">
          {isOpen ? "▼" : "▶"}
        </button>
      </div>

      {/* 내용 */}
      {isOpen && (
        <div className="bg-bg-page p-6 text-sm text-text-secondary space-y-3">
          {feedback ? (
            <p className="whitespace-pre-wrap leading-relaxed">{feedback}</p>
          ) : (
            <p className="text-gray-500">피드백이 제공되지 않았습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFeedbackSection;