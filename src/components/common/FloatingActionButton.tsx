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
              className="flex items-center gap-3 px-5 py-3 bg-white text-gray-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-gray-100 hover:border-blue-200"
            >
              <span className="text-sm font-semibold whitespace-nowrap group-hover:text-blue-600 transition-colors">
                동영상 업로드
              </span>
              <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-110">
                <Upload size={20} className="text-white" strokeWidth={2.5} />
              </div>
            </button>
          </div>
        )}

        {/* 메인 FAB 버튼 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-16 h-16 rounded-full shadow-2xl 
            flex items-center justify-center 
            transition-all duration-300 
            hover:scale-110 active:scale-95
            ${
              isExpanded
                ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rotate-45"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }
          `}
        >
          {isExpanded ? (
            <X size={28} className="text-white" strokeWidth={2.5} />
          ) : (
            <Plus size={32} className="text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;