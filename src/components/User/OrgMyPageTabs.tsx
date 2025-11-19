import React from "react";
import { cn } from "@/utils/cn";

interface MyPageTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MyPageTabs: React.FC<MyPageTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "learning", label: "시청 기록", icon: "/icon/learn-icon.png" },
    { id: "quiz", label: "AI 퀴즈", icon: "/icon/ox-icon.png" },
    { id: "scrap", label: "스크랩", icon: "/icon/scrap-icon.png" },
    { id: "comment", label: "작성한 댓글", icon: "/icon/my-comment-icon.png" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border-light">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {/* 아이콘 */}
            <img
              src={tab.icon}
              alt={tab.label}
              className={cn(
                "w-7 h-7 object-contain transition-all duration-200",
                isActive ? "opacity-100 scale-110" : "opacity-60"
              )}
            />
            
            {/* 텍스트 */}
            <span className={cn(
              "transition-all duration-200",
              isActive && "font-semibold"
            )}>
              {tab.label}
            </span>

            {/* 하단 밑줄 */}
            <span
              className={cn(
                "absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300",
                isActive ? "bg-primary scale-x-100" : "bg-transparent scale-x-0"
              )}
            ></span>
          </button>
        );
      })}
    </div>
  );
};

export default MyPageTabs;