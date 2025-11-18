import React from "react";
import { BookOpen } from "lucide-react";

export interface AISummarySectionProps {
  isOpen: boolean;
  onToggle: () => void;
  summary: string; 
}

const AISummarySection: React.FC<AISummarySectionProps> = ({
  isOpen,
  onToggle,
  summary,
}) => {
  return (
    <div className="bg-bg-card border border-border-light rounded-xl shadow-base overflow-hidden">
      <div
        onClick={onToggle}
        className="flex justify-between items-center px-6 py-4 border-b border-border-light hover:bg-border-strong cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary" size={22} />
          <h3 className="text-lg font-semibold text-text-primary">AI 요약</h3>
        </div>

        <button className="text-text-link text-lg hover:scale-110 transition-transform">
          {isOpen ? "▼" : "▶"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-bg-page p-6 text-sm text-text-secondary space-y-3">
          {summary ? (
            <div className="bg-white rounded-lg border border-border-light p-4 shadow-sm">
              <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            </div>
          ) : (
            <p className="text-gray-500">AI 요약이 제공되지 않았습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AISummarySection;