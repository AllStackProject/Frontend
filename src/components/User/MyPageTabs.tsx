import React from "react";
import { cn } from "@/utils/cn";

interface MyPageTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MyPageTabs: React.FC<MyPageTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "learning", label: "내 기록", icon: "/icon/learn-icon.png" },
    { id: "quiz", label: "AI 퀴즈", icon: "/icon/ox-icon.png" },
    { id: "scrap", label: "스크랩", icon: "/icon/scrap-icon.png" },
    { id: "comment", label: "내 댓글", icon: "/icon/my-comment-icon.png" },
    { id: "groups", label: "내 조직", icon: "/icon/org-icon.png" },
    { id: "profile", label: "내 정보", icon: "/icon/profile-icon.png" },
    { id: "settings", label: "알림 설정", icon: "/icon/noti-icon.png" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border-light pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-base font-medium transition-all duration-200 rounded-md",
              isActive
                ? "text-primary font-semibold bg-accent-light"
                : "text-text-secondary hover:text-primary hover:bg-gray-50"
            )}
          >
            {/* 아이콘 */}
            <img
              src={tab.icon}
              alt={tab.label}
              className="w-9 h-9 object-contain opacity-80"
            />
            {/* 텍스트 */}
            <span>{tab.label}</span>

            {/* 밑줄 애니메이션 */}
            <span
              className={cn(
                "absolute bottom-0 left-0 w-full h-[3px] rounded-full transition-all duration-300",
                isActive ? "bg-primary" : "bg-transparent"
              )}
            ></span>
          </button>
        );
      })}
    </div>
  );
};

export default MyPageTabs;
