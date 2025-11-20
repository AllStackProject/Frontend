import React, { useState } from "react";
import { TrendingUp, Users, Video } from "lucide-react";
import GroupComparisonSection from "@/components/admin/report/GroupComparisonSection";
import VideoRankingSection from "@/components/admin/report/VideoRankingSection";
import TimePatternSection from "@/components/admin/report/TimePatternSection";
import DropOffAnalysisSection from "@/components/admin/report/DropOffAnalysisSection";
import DemographicSection from "@/components/admin/report/DemographicSection";
import VideoAnalyticsSection from "@/components/admin/report/VideoAnalyticsSection";

type TabType =  "activity" | "users" | "content";

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("activity");


  const tabs = [
    { 
      id: "activity", 
      label: "활동 분석", 
      icon: TrendingUp,
      description: "시청 완료율, 시간대 패턴, 이탈 분석"
    },
    { 
      id: "users", 
      label: "사용자 분석", 
      icon: Users,
      description: "그룹 비교 및 인구통계"
    },
    { 
      id: "content", 
      label: "콘텐츠 분석", 
      icon: Video,
      description: "동영상 랭킹 및 성과"
    },
  ];

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">통계 및 리포트</h1>
        <p className="text-sm text-gray-600">
          시청률, 시간대별 분석 등 조직의 시청 데이터를 시각화하여 확인합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary "
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="space-y-6">
        {activeTab === "activity" && (
          <>
            <TimePatternSection />
          </>
        )}

        {activeTab === "users" && (
          <>
            <GroupComparisonSection />
            <DemographicSection />
          </>
        )}

        {activeTab === "content" && (
          <>
            <VideoAnalyticsSection/>
            <VideoRankingSection />
            <DropOffAnalysisSection />
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;