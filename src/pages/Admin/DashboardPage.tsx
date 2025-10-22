import React from "react";
import DashboardCard from "@/components/Admin/DashboardCard";

const DashboardPage: React.FC = () => {
  const stats = [
    { label: "총 사용자", value: "1,203명" },
    { label: "총 동영상", value: "356개" },
    { label: "이번 주 시청 수", value: "2,941회" },
    { label: "광고 매출", value: "₩1,540,000" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">관리자 대시보드</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <DashboardCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-10 bg-white border rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">최근 활동 요약</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ 새로운 사용자 5명 가입</li>
          <li>🎬 신규 업로드 동영상 3건</li>
          <li>💬 댓글 12건 추가</li>
          <li>⚙️ 시스템 점검 완료</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;