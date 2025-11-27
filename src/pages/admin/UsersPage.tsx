import React, { useState } from "react";
import UserListSection from "@/components/admin/user/UserListSection";
import UserInviteSection from "@/components/admin/user/UserInviteSection";

const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">멤버 관리</h1>
        <p className="text-sm text-gray-600">조직에 속한 멤버 목록을 확인하고 권한 부여합니다. 또한, 가입 요청한 사용자의 가입을 관리합니다.</p>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-3 border-b border-gray-200 mb-6">
        {[
          { key: "list", label: "조직 멤버 목록" },
          { key: "invite", label: "가입 승인" },
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

      {/* 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        {activeTab === "list" && <UserListSection />}
        {activeTab === "invite" && <UserInviteSection />}
      </div>
    </div>
  );
};

export default UsersPage;