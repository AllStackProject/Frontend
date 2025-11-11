import { useState, useRef, useEffect } from "react";
import {
  Search, ChevronDown, ShieldUser, BookOpen, Megaphone,
  Bookmark, Home, Menu, X, Settings, Building2, User,
  MessageSquare, MessageCircle, UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizationSelectModal from "@/components/common/modals/OrganizationSelectModal";
import { getUserInfo } from "@/api/mypage/user";
import { getOrganizations } from "@/api/orgs/getOrg";
import type { OrganizationResponse } from "@/types/org";
import { useLogout } from "@/api/auth/useLogout";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("사용자");
  const [isAdmin, setIsAdmin] = useState(false);

  const { openLogoutModal, LogoutModal } = useLogout(navigate);

  const [organization, setOrganization] = useState(
    localStorage.getItem("org_name") || "조직 선택 안됨"
  );
  const [orgId] = useState<number | null>(
    localStorage.getItem("org_id") ? Number(localStorage.getItem("org_id")) : null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  //  로그인 사용자 정보 불러오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUserName(data.name || "사용자");
      } catch (err) {
        console.error("🚨 사용자 정보 로드 실패:", err);
      }
    };
    fetchUser();
  }, []);

  // 조직 관리자 여부 확인
  useEffect(() => {
  const checkAdminStatus = async () => {
    try {
      const orgs: OrganizationResponse[] = await getOrganizations();

      if (!orgId) {
        setIsAdmin(false);
        return;
      }

      const selectedOrg = orgs.find((org) => org.id === orgId);

      // 관리자이면서 승인된 조직일 때만 true
      if (selectedOrg?.is_admin && selectedOrg.join_status === "APPROVED") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("🚨 조직 정보 확인 실패:", err);
      setIsAdmin(false);
    }
  };

  checkAdminStatus();
}, [orgId]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 메뉴 아이템 타입 정의
  type MenuItem = {
    icon?: any;
    label: string;
    path?: string;
    type?: "divider";
    isParent?: boolean;
    isChild?: boolean;
  };

  const menuItems: MenuItem[] = [
    { icon: Home, label: "홈", path: "/home" },
    { type: "divider", label: "" },
    { icon: Building2, label: `${organization}에서 내 활동`, path: "/orgmypage", isParent: true },
    { icon: BookOpen, label: "시청 기록", path: "/orgmypage/learning", isChild: true },
    { icon: MessageSquare, label: "AI 퀴즈", path: "/orgmypage/quiz", isChild: true },
    { icon: Bookmark, label: "스크랩", path: "/orgmypage/scrap", isChild: true },
    { icon: MessageCircle, label: "작성한 댓글", path: "/orgmypage/comment", isChild: true },
    { type: "divider", label: "" },
    { icon: User, label: "마이페이지", path: "/usermypage", isParent: true },
    { icon: ShieldUser, label: "내 조직", path: "/usermypage/groups", isChild: true },
    { icon: UserCircle, label: "내 정보", path: "/usermypage/profile", isChild: true }
  ];

  return (
    <>
      <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300">

        {/* 왼쪽: 로고 */}
        <div
          className="flex items-center gap-2 px-2 sm:px-4 md:px-8 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/home")}
        >
          <img src="/logo.png" alt="Privideo" className="w-40" />
        </div>

        {/* 중앙: 검색창 (데스크톱만 표시) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2.5 w-full max-w-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">

            {/* 조직 선택 */}
            <div
              className="flex items-center gap-2 pr-3 border-r border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            >
              <img src="/dummy/woori-logo.png" alt="org" className="w-6 h-6 rounded-full" />
              <span className="font-medium text-gray-700 text-sm whitespace-nowrap">{organization}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>

            {/* 입력창 */}
            <input
              type="text"
              placeholder="원하는 영상을 검색해 보세요.."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 px-3 text-sm"
            />

            {/* 검색 버튼 */}
            <button className="flex items-center justify-center bg-primary-light hover:bg-primary text-white rounded-full w-9 h-9 transition-all duration-300 shadow-md hover:shadow-lg">
              <Search className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* 오른쪽: 관리자 버튼 + 알림 + 프로필 (중간 화면 이상) */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 px-2 sm:px-4 md:px-8">

          {/* 관리자 버튼 */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="group relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
              title="관리자 페이지"
            >
              <Settings
                size={18}
                className="text-purple-600 group-hover:rotate-90 transition-transform duration-300"
              />
              <span className="text-xs font-semibold text-purple-700 hidden lg:block">
                관리자
              </span>
            </button>
          )}

          {/* 공지사항 */}
          <button
            onClick={() => navigate("/notice")}
            className="relative p-2 text-gray-600 hover:text-blue-500 transition rounded-lg hover:bg-gray-50"
            title="공지사항"
          >
            <Megaphone size={22} />
          </button>

          {/* 프로필 */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 lg:gap-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/user-icon/user9.png" alt="user" className="rounded-full w-8 h-8 lg:w-10 lg:h-10" />
              <span className="font-semibold text-gray-700 text-sm hidden lg:block">
                {userName}
              </span>
              <ChevronDown className="text-gray-500 w-4 h-4" />
            </button>

            {/* 프로필 드롭다운 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-xl border border-gray-100 py-3 z-50 animate-fadeIn">
                {menuItems.map((item, index) => {
                  // 구분선
                  if (item.type === "divider") {
                    return <hr key={`divider-${index}`} className="my-2 border-gray-200" />;
                  }

                  const Icon = item.icon;
                  const isParent = item.isParent;
                  const isChild = item.isChild;

                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${isChild ? "pl-8" : ""
                        } ${isParent ? "font-semibold" : ""}`}
                      onClick={() => {
                        if (item.path) {
                          navigate(item.path);
                          setIsDropdownOpen(false);
                        }
                      }}
                    >
                      {Icon && (
                        <Icon
                          size={isChild ? 14 : 16}
                          className={`${isParent ? "text-gray-700" : "text-gray-500"} ${isChild ? "opacity-70" : ""}`}
                        />
                      )}
                      <span className={`text-sm ${isParent ? "text-gray-800" : "text-gray-700"}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
                <hr className="my-2 border-gray-200" />
                <div className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors" 
                onClick={openLogoutModal}>
                  로그아웃
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 모바일: 햄버거 메뉴 + 검색 버튼 */}
        <div className="flex md:hidden items-center gap-3">
          <button className="text-gray-600 hover:text-blue-500">
            <Search size={20} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-blue-500"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[57px] bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-lg p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 프로필 정보 */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
              <img src="/user9.png" alt="user" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-gray-800">홍길동</p>
                <p className="text-xs text-gray-500">{organization}</p>
              </div>
            </div>

            {/* 관리자 버튼 (모바일 - 관리자만 표시) */}
            {isAdmin && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    navigate("/admin");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border border-purple-200 rounded-lg transition-all"
                >
                  <div className="relative">
                    <Settings size={18} className="text-purple-600" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">관리자 페이지</span>
                </button>
              </div>
            )}

            {/* 메뉴 */}
            {menuItems.map((item, index) => {
              // 구분선
              if (item.type === "divider") {
                return <hr key={`mobile-divider-${index}`} className="my-3 border-gray-200" />;
              }

              const Icon = item.icon;
              const isParent = item.isParent;
              const isChild = item.isChild;

              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-1 transition-colors ${isChild ? "pl-8" : ""
                    } ${isParent ? "font-semibold" : ""}`}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  {Icon && (
                    <Icon
                      size={isChild ? 16 : 18}
                      className={`${isParent ? "text-gray-700" : "text-gray-500"} ${isChild ? "opacity-70" : ""}`}
                    />
                  )}
                  <span className={`text-sm ${isParent ? "text-gray-800" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}

            <hr className="my-4" />
            <div
              className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={openLogoutModal}>
              로그아웃
            </div>
          </div>
        </div>
      )}
      
      {/* 로그아웃 모달 추가 */}
      <LogoutModal />

      {/* 조직 선택 모달 */}
      <OrganizationSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(org) => {
          setOrganization(org);
          localStorage.setItem("selectedOrgName", org);
        }}
      />
    </>
  );
};

export default Navbar;