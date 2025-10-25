import React, { useState } from "react";
import { Home, X, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Organization {
  id: number;
  name: string;
  logo: string;
}

type UserRole = "admin" | "manager";

interface HeaderProps {
  userRole?: UserRole;
}

const Header: React.FC<HeaderProps> = ({ userRole = "admin" }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization>({
    id: 1,
    name: "우리 FISA",
    logo: "/dummy/woori-logo.png",
  });

  const organizations: Organization[] = [
    { id: 1, name: "우리 FISA", logo: "/dummy/woori-logo.png" },
    { id: 2, name: "PASTA EDU", logo: "/dummy/woori-logo.png" },
    { id: 3, name: "Tech Academy", logo: "/dummy/woori-logo.png" },
  ];

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setIsModalOpen(false);
  };

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

  return (
    <>
      {/* 헤더 */}
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        {/* 조직 정보 */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={selectedOrg.logo}
            alt={selectedOrg.name}
            className="w-10 h-10 rounded-md object-cover border border-gray-300"
          />
          <div>
            <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {selectedOrg.name}
            </h2>
            <p className="text-xs text-gray-500">{getRoleText()}</p>
          </div>
        </div>

        {/* 관리자 이름 + 홈 버튼 */}
        <div className="flex items-center gap-4">
          {/* 관리자 이름 */}
          <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
            <UserCircle size={18} className="text-blue-500" />
            <span>
              <span className="text-blue-600">홍길동</span>님
            </span>
          </div>

          {/* 홈으로 이동 버튼 */}
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
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">조직 선택</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 조직 리스트 */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                    selectedOrg.id === org.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{org.name}</h4>
                    <p className="text-xs text-gray-500">
                      {selectedOrg.id === org.id ? "✓ 현재 선택됨" : "클릭하여 선택"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 닫기 버튼 */}
            <div className="flex justify-end mt-5 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;