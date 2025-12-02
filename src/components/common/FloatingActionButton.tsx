import React, { useState, useEffect } from "react";
import { Plus, Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useUpload } from "@/context/UploadContext";

interface FloatingActionButtonProps {
  onUploadClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onUploadClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadStatus, setShowUploadStatus] = useState(true);

  // 전역 업로드 컨텍스트
  const { isUploading, uploadTitle, uploadStartTime, status } = useUpload();

  // 상태에 따른 UI 설정
  const getStatusConfig = () => {
    switch (status) {
      case "IN_PROGRESS":
        return {
          icon: <Loader2 size={24} className="animate-spin text-blue-600" strokeWidth={2.5} />,
          bgGradient: "from-blue-50 to-indigo-50",
          borderColor: "border-blue-100",
          badge: { text: "업로드 중", color: "bg-blue-100 text-blue-700" },
          message: "업로드가 완료되면 알림이 표시됩니다.",
          showClose: false,
          showPulse: true,
        };
      case "COMPLETE":
        return {
          icon: <CheckCircle2 size={24} className="text-green-600" strokeWidth={2.5} />,
          bgGradient: "from-green-50 to-emerald-50",
          borderColor: "border-green-100",
          badge: { text: "업로드 완료", color: "bg-green-100 text-green-700" },
          message: "영상이 성공적으로 업로드되었습니다!",
          showClose: true,
          showPulse: false,
        };
      case "FAIL":
        return {
          icon: <AlertCircle size={24} className="text-red-600" strokeWidth={2.5} />,
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-100",
          badge: { text: "업로드 실패", color: "bg-red-100 text-red-700" },
          message: "업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
          showClose: true,
          showPulse: false,
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();
  const shouldShowModal = status !== "IDLE" && showUploadStatus;

  // 상태가 변경되면 모달 다시 표시
  useEffect(() => {
    if (isUploading && status !== "IDLE") {
      setShowUploadStatus(true);
    }
  }, [isUploading, status]);

  return (
    <>
      {/* 오버레이 */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 업로드 상태 바 - 상태별 UI */}
      {shouldShowModal && statusConfig && (
        <div className="fixed bottom-28 right-8 z-20 animate-slide-up">
          <div className={`bg-white shadow-2xl rounded-2xl p-5 w-80 border-2 ${statusConfig.borderColor} overflow-hidden relative`}>
            {/* 닫기 버튼 (완료/실패 시에만 표시) */}
            {statusConfig.showClose && (
              <button
                onClick={() => setShowUploadStatus(false)}
                className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="닫기"
              >
                <X size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            )}

            <div className="flex items-start gap-4">
              {/* 상태 아이콘 */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${statusConfig.bgGradient} flex items-center justify-center`}>
                  {statusConfig.icon}
                </div>
              </div>

              {/* 텍스트 정보 */}
              <div className="flex-1 min-w-0 pr-6">
                {/* 제목 + 배지 */}
                  <div className="flex items-start justify-between gap-2 mb-2 w-full">
                    {/* 제목: 2줄, ... 처리 */}
                    <span className="text-sm font-bold text-gray-900 line-clamp-2 flex-1 min-w-0">
                      {uploadTitle}
                    </span>

                    {/* 배지 */}
                    <span
                      className={`
                        px-2 py-0.5 whitespace-nowrap text-xs font-semibold rounded-full
                        ${statusConfig.badge.color}`}>
                      {statusConfig.badge.text}
                    </span>
                  </div>

                {uploadStartTime && (
                  <p className="text-xs text-gray-500 mb-3">
                    시작 시간: {uploadStartTime}
                  </p>
                )}

                <p className="text-xs text-gray-600 leading-relaxed">
                  {statusConfig.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* 확장된 메뉴 */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 animate-fade-in">
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

        {/* 메인 FAB */}
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