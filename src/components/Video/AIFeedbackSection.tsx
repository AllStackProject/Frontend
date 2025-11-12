import React from "react";
import { MessageSquareText } from "lucide-react";

interface AIFeedbackSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AIFeedbackSection: React.FC<AIFeedbackSectionProps> = ({
  isOpen,
  onToggle,
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
          <p>💬 AI가 학습 내용을 분석한 피드백을 제공합니다.</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>핵심 요약은 잘 되었어요 👏</li>
            <li>예시를 조금 더 구체적으로 작성해보세요.</li>
            <li>좋은 학습 태도를 유지하고 있습니다!</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIFeedbackSection;