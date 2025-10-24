import React, { useState } from "react";
import PlanSection from "@/components/Admin/Plans/PlanSection";
import AdSection from "@/components/Admin/Plans/AdSection";

const PlansPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"plan" | "ad">("plan");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">요금제 & 광고 관리</h1>
        <p className="text-sm text-gray-600">조직의 요금제 상태를 확인하고 배너 광고를 등록 및 변경할 수 있습니다.</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-3 border-b border-gray-200 mb-6">
        {[
          { key: "plan", label: "요금제 관리" },
          { key: "ad", label: "광고 관리" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "plan" | "ad")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        {activeTab === "plan" && <PlanSection />}
        {activeTab === "ad" && <AdSection />}
      </div>
    </div>
  );
};

export default PlansPage;