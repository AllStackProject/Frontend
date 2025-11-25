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
    <div className="top-0 z-10 border-b bg-white rounded-t-lg">
      <div
        className="
          flex items-center gap-2
          px-2 py-2
          overflow-x-auto scrollbar-hide
          sm:justify-center sm:gap-3
          sm:px-4 sm:py-2
        "
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                `relative flex items-center gap-2 
                 px-3 py-2 
                 text-sm font-medium whitespace-nowrap 
                 group transition-all duration-200
                 sm:px-4 sm:py-2`,
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-t-lg"
              )}
            >
              {/* 데스크탑 아이콘 (크기도 축소) */}
              <div
                className={cn(
                  "hidden sm:flex p-1 rounded-md transition-all duration-200",
                  isActive ? "bg-blue-50" : "bg-gray-50 group-hover:bg-gray-100"
                )}
              >
                <img
                  src={tab.icon}
                  className={cn(
                    "w-4 h-4 object-contain transition-all duration-200",
                    isActive
                      ? "opacity-100 scale-105"
                      : "opacity-70 group-hover:opacity-90"
                  )}
                />
              </div>

              {/* 텍스트 */}
              <span
                className={cn(
                  "transition-all duration-200 text-sm",
                  isActive && "font-bold"
                )}
              >
                {tab.label}
              </span>

              {/* 하단 라인 */}
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-[2px] rounded-t-full transition-all duration-200",
                  isActive
                    ? "bg-blue-500 scale-x-100"
                    : "bg-transparent scale-x-0 group-hover:scale-x-50 group-hover:bg-gray-300"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* 스크롤바 숨김 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MyPageTabs;