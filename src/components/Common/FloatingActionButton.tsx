import React, { useState } from "react";
import { Plus, Upload, X } from "lucide-react";

interface FloatingActionButtonProps {
  onUploadClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onUploadClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* 오버레이 */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* 확장된 메뉴 */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 animate-fade-in">
            {/* 동영상 업로드 버튼 */}
            <button
              onClick={() => {
                setIsExpanded(false);
                onUploadClick();
              }}
              className="flex items-center gap-3 px-4 py-3 bg-white text-text-primary rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group border border-border-light"
            >
              <span className="text-sm font-medium whitespace-nowrap">
                동영상 업로드
              </span>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary-light transition-colors">
                <Upload size={20} className="text-white" />
              </div>
            </button>
          </div>
        )}

        {/* 메인 FAB 버튼 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isExpanded
              ? "bg-error hover:bg-red-600 rotate-45"
              : "bg-primary hover:bg-primary-light hover:scale-110"
          }`}
        >
          {isExpanded ? (
            <X size={24} className="text-white" />
          ) : (
            <Plus size={28} className="text-white" />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;