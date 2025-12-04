import React, { useState, useEffect } from "react";
import { Home, X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchOrgInfo } from "@/api/adminOrg/info";
import OrganizationSelectModal from "@/components/common/modals/OrganizationSelectModal";

type UserRole = "admin" | "manager";

interface HeaderProps {
  userRole?: UserRole;
}

const Header: React.FC<HeaderProps> = ({ userRole = "admin" }) => {
  const navigate = useNavigate();
  const { nickname, orgName, orgId } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로딩 상태 + 기본 이미지 설정
  const [orgImage, setOrgImage] = useState<string>("/dummy/woori-logo.png");
  const [isOrgImageLoading, setIsOrgImageLoading] = useState(true);

  // 권한별 역할 표시 텍스트
  const getRoleText = () => {
    switch (userRole) {
      case "admin":
        return "Admin";
      case "manager":
        return "Manager";
      default:
        return "Admin";
    }
  };

  /** -----------------------------
   *  조직 이미지 로드
   --------------------------------*/
  useEffect(() => {
    const loadOrgInfo = async () => {
      if (!orgId) return;

      setIsOrgImageLoading(true);

      try {
        const info = await fetchOrgInfo(orgId);

        let url = info.img_url;

        if (url && !url.startsWith("http")) {
          url = "https://" + url;
        }

        setOrgImage(url || "/dummy/woori-logo.png");
      } catch (error) {
        console.error("❌ 조직 정보 불러오기 실패:", error);
        setOrgImage("/dummy/woori-logo.png");
      } finally {
        setIsOrgImageLoading(false);
      }
    };

    loadOrgInfo();
  }, [orgId]);

  return (
    <>
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        
        {/* 조직 정보 */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={
              isOrgImageLoading
                ? "/dummy/woori-logo.png"
                : orgImage || "/dummy/woori-logo.png"
            }
            className="w-10 h-10 rounded-md object-cover border border-gray-300 transition-all duration-300"
            alt="org logo"
          />

          <div>
            <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {orgName}
            </h2>
            <p className="text-xs text-gray-500">{getRoleText()}</p>
          </div>
        </div>

        {/* 관리자 이름 + 홈 버튼 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
            <UserCircle size={18} className="text-blue-500" />
            <span>
              <span className="text-blue-600">{nickname}</span>님
            </span>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-sm text-blue-600 font-medium transition"
          >
            <Home size={18} />
            메인 화면
          </button>
        </div>
      </header>

      {/* 조직 선택 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">조직 선택</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <OrganizationSelectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSelect={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;