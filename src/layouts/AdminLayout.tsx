import Header from "@/components/admin/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrganizations } from "@/api/organization/orgs";
import Sidebar from "@/components/admin/Sidebar";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { orgId } = useAuth();

  const [permissions, setPermissions] = useState({
    is_super_admin: false,
    video_manage: false,
    stats_report_manage: false,
    notice_manage: false,
    org_setting_manage: false,
  });

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const orgs = await getOrganizations();
        const org = orgs.find((o) => o.id === orgId);

        if (org) {
          setPermissions({
            is_super_admin: org.is_super_admin,
            video_manage: org.video_manage,
            stats_report_manage: org.stats_report_manage,
            notice_manage: org.notice_manage,
            org_setting_manage: org.org_setting_manage,
          });
        }
      } catch (e) {
        console.error("🚨 권한 로드 실패:", e);
      }
    };

    if (orgId) loadPermissions();
  }, [orgId]);

  return (
    <div className="flex min-h-screen bg-gray-70 relative">
      <Sidebar permissions={permissions} />

      <div className="flex flex-col flex-1 relative">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <Header />
        </div>
        <main className="flex-1 p-2">
          <Outlet context={permissions} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;