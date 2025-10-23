import React from "react";
import OrganizationSection from "@/components/Admin/Setting/OrganizationSection";

const OrganizationSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">조직 설정</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <OrganizationSection />
      </div>
    </div>
  );
};

export default OrganizationSettingsPage;