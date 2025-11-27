import React, { useState } from "react";
import AttendanceSection from "@/components/admin/learning/AttendanceSection";
import LearningReportSection from "@/components/admin/learning/LearningReportSection";

const LearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleOpenReport = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab("report");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">멤버별 동영상 시청 관리</h1>
        <p className="text-sm text-gray-600">각 멤버의 동영상 시청 현황과 학습 리포트를 조회할 수 있습니다.</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-3 border-b border-gray-200 mb-6">
        {[
          { key: "attendance", label: "시청 관리" },
          { key: "report", label: "멤버별 시청 리포트" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        {activeTab === "attendance" && (
          <AttendanceSection onOpenReport={handleOpenReport} />
        )}
        {activeTab === "report" && (
          <LearningReportSection initialUserId={selectedUserId || undefined} />
        )}
      </div>
    </div>
  );
};

export default LearningPage;