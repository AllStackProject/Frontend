import React from "react";
import OrganizationSection from "@/components/admin/setting/OrganizationSection";

const OrganizationSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">조직 설정</h1>
        <p className="text-sm text-gray-600">초대 코드, 그룹 및 카테고리 설정 등 기본 정보를 관리합니다.</p>
      </div>

      <OrganizationSection />
    </div>
  );
};

export default OrganizationSettingsPage;