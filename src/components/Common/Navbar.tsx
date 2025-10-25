import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ShieldUser,
  BookOpen,
  BellRing,
  Bookmark,
  Home,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizationSelectModal from "@/components/Common/OrganizationSelectModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [organization, setOrganization] = useState("우리 FISA");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "📢 새로운 강의 'AI 기초반'이 업로드되었습니다.", read: false },
    { id: 2, text: "🎓 '데이터 분석' 수강평이 업데이트되었습니다.", read: false },
    { id: 3, text: "⭐ 회원 등급이 'Pro'로 승급되었습니다.", read: true },
    { id: 4, text: "📢 새로운 강의 'AI 기초반'이 업로드되었습니다.", read: true },
    { id: 5, text: "🎓 '데이터 분석' 수강평이 업데이트되었습니다.", read: false },
    { id: 6, text: "⭐ 회원 등급이 'Pro'로 승급되었습니다.", read: true },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
 
  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 모두 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 안 읽은 알림 개수
  const unreadCount = notifications.filter((n) => !n.read).length;

  const menuItems = [
  { icon: Home, label: "홈", path: "/home" },
  { icon: BookOpen, label: "내 기록", path: "/mypage/learning" },
  { icon: Bookmark, label: "스크랩", path: "/mypage/scrap" },
  { icon: ShieldUser, label: "내 조직", path: "/mypage/groups" },
  { icon: BellRing, label: "알림 설정", path: "/mypage/settings" },
];

  return (
    <>
      <header className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300">
        
        {/* 왼쪽: 로고 */}
        <div
          className="flex items-center gap-2 px-2 sm:px-4 md:px-8 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/home")}
        >
          <img src="/logo.png" alt="Privideo" className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11" />
          <p className="text-base sm:text-lg font-semibold text-gray-800 hidden sm:block">Privideo</p>
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

        {/* 오른쪽: 알림 + 프로필 (중간 화면 이상) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 px-2 sm:px-4 md:px-8">
          
          {/* 알림 */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative text-base text-gray-600 hover:text-blue-500 transition"
            >
              <Bell size={20} className="md:w-[22px] md:h-[22px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* 알림 드롭다운 */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl border border-gray-100 py-3 z-50 animate-fadeIn">
                <div className="flex justify-between items-center px-4 pb-2 border-b border-gray-100">
                  <span className="font-semibold text-gray-800">알림</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      모두 읽음 표시
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-2 text-sm cursor-pointer transition ${
                          n.read
                            ? "text-gray-600 hover:bg-gray-50"
                            : "bg-blue-50 text-gray-800 font-semibold hover:bg-blue-100"
                        }`}
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((m) =>
                              m.id === n.id ? { ...m, read: true } : m
                            )
                          )
                        }
                      >
                        {n.text}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-400 text-center">
                      새로운 알림이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 프로필 */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 lg:gap-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/user-icon/user9.png" alt="user" className="rounded-full w-8 h-8 lg:w-10 lg:h-10" />
              <span className="font-semibold text-gray-700 text-sm hidden lg:block">홍길동</span>
              <ChevronDown className="text-gray-500 w-4 h-4" />
            </button>

            {/* 프로필 드롭다운 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-xl border border-gray-100 py-5 z-50 animate-fadeIn">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(path)}
                  >
                    <Icon size={16} className="text-gray-500" />
                    <span className="text-base text-gray-700">{label}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer">
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

            {/* 알림 */}
            <div className="mb-4">
              <div 
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsNotifOpen(true);
                }}
              >
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-700">알림</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* 메뉴 */}
            {menuItems.map(({ icon: Icon, label, path }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer mb-1"
                onClick={() => {
                  navigate(path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <Icon size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}

            <hr className="my-4" />
            <div 
              className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              로그아웃
            </div>
          </div>
        </div>
      )}

      {/* 조직 선택 모달 */}
      <OrganizationSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(org) => setOrganization(org)}
      />
    </>
  );
};

export default Navbar;