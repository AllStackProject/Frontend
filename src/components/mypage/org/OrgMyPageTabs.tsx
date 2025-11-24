import React from "react";
import { cn } from "@/utils/cn";

interface MyPageTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MyPageTabs: React.FC<MyPageTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "learning", label: "내 기록", icon: "/icon/learn-icon.png" },
    { id: "scrap", label: "스크랩", icon: "/icon/scrap-icon.png" },
    { id: "comment", label: "내 댓글", icon: "/icon/my-comment-icon.png" },
    { id: "myvideo", label: "내 영상", icon: "/icon/video-icon.png" },
    { id: "orgsetting", label: "조직 설정", icon: "/icon/settings-icon.png" },
  ];

  return (
    <div className="top-0 z-10 border-b">
      <div className="flex items-center gap-2 px-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2.5 px-5 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap group",
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {/* 아이콘 컨테이너 */}
              <div className={cn(
                "relative p-1.5 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-blue-50" 
                  : "bg-gray-50 group-hover:bg-gray-100"
              )}>
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className={cn(
                    "w-5 h-5 object-contain transition-all duration-300",
                    isActive ? "opacity-100 scale-110" : "opacity-70 group-hover:opacity-90 group-hover:scale-105"
                  )}
                />
              </div>
              
              {/* 텍스트 */}
              <span className={cn(
                "transition-all duration-300",
                isActive && "font-bold"
              )}>
                {tab.label}
              </span>

              {/* 하단 밑줄 - 그라데이션 */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-1 rounded-t-full transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-100" 
                    : "bg-transparent scale-x-0 group-hover:scale-x-50 group-hover:bg-gray-300"
                )}
              ></span>

              {/* 활성 배경 효과 */}
              {isActive && (
                <span className="absolute inset-0 bg-blue-50/50 rounded-t-lg -z-10"></span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MyPageTabs;