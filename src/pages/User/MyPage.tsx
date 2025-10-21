import React, { useState } from "react";
import MyPageTabs from "@/components/User/MyPageTabs";
import LearningSection from "@/components/User/LearningSection";
import QuizSection from "@/components/User/QuizSection";
import ScrapSection from "@/components/User/ScrapSection";
import CommentSection from "@/components/User/CommentSection";
import ProfileSection from "@/components/User/ProfileSection";
import GroupSection from "@/components/User/OrganizationSection";
import SettingsSection from "@/components/User/SettingsSection";

const MyPagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("learning");

  const renderSection = () => {
    switch (activeTab) {
      case "learning":
        return <LearningSection />;
      case "quiz":
        return <QuizSection />;
      case "scrap":
        return <ScrapSection />;
      case "comment":
        return <CommentSection />;
      case "settings":
        return <SettingsSection />;
      case "profile":
        return <ProfileSection />;
      case "groups":
        return <GroupSection />;
      default:
        return <LearningSection />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-page py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* 제목 */}
        <h1 className="text-3xl font-bold text-text-primary mb-6">마이페이지</h1>

        {/* 탭 메뉴 */}
        <MyPageTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 섹션 내용 */}
        <div className="mt-8 bg-bg-card border border-border-light rounded-xl shadow-base p-6 transition-all">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default MyPagePage;