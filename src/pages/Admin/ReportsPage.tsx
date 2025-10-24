import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, Video } from "lucide-react";
import OverviewSection from "@/components/Admin/Report/OverviewSection";
import ActivityChartSection from "@/components/Admin/Report/ActivityChartSection";
import GroupComparisonSection from "@/components/Admin/Report/GroupComparisonSection";
import VideoRankingSection from "@/components/Admin/Report/VideoRankingSection";
import TimePatternSection from "@/components/Admin/Report/TimePatternSection";
import DropOffAnalysisSection from "@/components/Admin/Report/DropOffAnalysisSection";
import DemographicSection from "@/components/Admin/Report/DemographicSection";
import ReportFilterBar from "@/components/Admin/Report/ReportFilterBar";

type TabType = "overview" | "activity" | "users" | "content";

const ReportsPage: React.FC = () => {
  const [period, setPeriod] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const tabs = [
    { 
      id: "overview", 
      label: "전체 개요", 
      icon: BarChart3,
      description: "주요 지표 및 활동 차트"
    },
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
          조직의 동영상 시청 현황과 사용자 활동을 분석합니다.
        </p>
      </div>

      {/* 필터바 */}
      <ReportFilterBar
        period={period}
        onChangePeriod={setPeriod}
        startDate={startDate}
        endDate={endDate}
        onChangeDateRange={handleDateRangeChange}
      />

      {/* 탭 네비게이션 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-blue-50"
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
        {activeTab === "overview" && (
          <>
            <OverviewSection />
            <ActivityChartSection />
          </>
        )}

        {activeTab === "activity" && (
          <>
            <TimePatternSection />
            <DropOffAnalysisSection />
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
            <VideoRankingSection />
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;