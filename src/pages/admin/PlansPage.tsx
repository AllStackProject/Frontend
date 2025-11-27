import React from "react";
import PlanSection from "@/components/admin/plans/PlanSection";

const PlansPage: React.FC = () => {

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">요금제 관리</h1>
        <p className="text-sm text-gray-600">조직의 요금제 상태를 확인하고 변경할 수 있습니다.</p>
      </div>

      {/* 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
         <PlanSection />
      </div>
    </div>
  );
};

export default PlansPage;