import React from "react";
import AttendanceSection from "@/components/admin/learning/AttendanceSection";

const LearningPage: React.FC = () => {

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">멤버별 동영상 시청 관리</h1>
        <p className="text-sm text-gray-600">각 멤버의 동영상 시청 현황과 학습 리포트를 조회할 수 있습니다.</p>
      </div>

      <AttendanceSection/>
    </div>
  );
};

export default LearningPage;