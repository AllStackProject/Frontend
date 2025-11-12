import React from "react";
import { BookOpen } from "lucide-react";

interface AISummarySectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AISummarySection: React.FC<AISummarySectionProps> = ({
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
          <BookOpen className="text-primary" size={22} />
          <h3 className="text-lg font-semibold text-text-primary">AI 요약</h3>
        </div>
        <button className="text-text-link text-lg hover:scale-110 transition-transform">
          {isOpen ? "▼" : "▶"}
        </button>
      </div>

      {/* 내용 */}
      {isOpen && (
        <div className="bg-bg-page p-6 text-sm text-text-secondary space-y-3">
          <p>🤖 영상 내용을 AI가 자동으로 요약합니다.</p>
          <div className="bg-white rounded-lg border border-border-light p-4 shadow-sm">
            <p>
              🎯 <strong>핵심 요약:</strong>
            </p>
            <p className="mt-2">
              이 영상은 클라우드 환경에서의 미디어 트랜스코딩 파이프라인을 다룹니다.
              S3 업로드, Lambda 트리거, MediaConvert를 통한 자동 처리 과정을 설명합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummarySection;