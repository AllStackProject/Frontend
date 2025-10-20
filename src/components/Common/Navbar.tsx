import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  User,
  BookOpen,
  Settings,
  Bookmark,
  Home,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizationSelectModal from "@/components/Common/OrganizationSelectModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [organization, setOrganization] = useState("우리 FISA");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "📢 새로운 강의 ‘AI 기초반’이 업로드되었습니다.", read: false },
    { id: 2, text: "🎓 ‘데이터 분석' 수강평이 업데이트되었습니다.", read: false },
    { id: 3, text: "⭐ 회원 등급이 ‘Pro’로 승급되었습니다.", read: true },
    { id: 4, text: "📢 새로운 강의 ‘AI 기초반’이 업로드되었습니다.", read: true },
    { id: 5, text: "🎓 ‘데이터 분석' 수강평이 업데이트되었습니다.", read: false },
    { id: 6, text: "⭐ 회원 등급이 ‘Pro’로 승급되었습니다.", read: true },
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

  return (
    <>
      <header
        className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 
                   sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300"
      >
        {/* 왼쪽: 로고 */}
        <div
          className="flex items-center gap-2 px-8 cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/home")}
        >
          <img src="/logo.png" alt="Privideo" className="w-11 h-11" />
          <p className="text-lg font-semibold text-gray-800">Privideo</p>
        </div>

        {/* 중앙: 검색창 */}
        <div className="flex-1 flex justify-center">
          <div
            className="flex items-center bg-white rounded-full px-5 py-3 w-3/5 max-w-2xl 
                       shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            {/* 조직 선택 */}
            <div
              className="flex items-center gap-2 pr-4 border-r border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsModalOpen(true)}
            >
              <img src="/woori-logo.png" alt="org" className="w-6 h-6 rounded-full" />
              <span className="font-medium text-gray-700">{organization}</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>

            {/* 입력창 */}
            <input
              type="text"
              placeholder="원하는 영상을 검색해 보세요.."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 px-4"
            />

            {/* 검색 버튼 */}
            <button
              className="flex items-center justify-center bg-[#3B82F6] hover:bg-[#2563EB]
                         text-white rounded-full w-10 h-10 transition-all duration-300 
                         shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* 오른쪽: 알림 + 프로필 */}
        <div className="flex items-center gap-6 px-8">
          {/* 알림 */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative text-base text-gray-600 hover:text-blue-500 transition relative top-[4px]"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* 알림 드롭다운 */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl border border-gray-100 py-3 z-50 animate-fadeIn">
                {/* 헤더 */}
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

                {/* 알림 목록 */}
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
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="/user9.png" alt="user" className="rounded-full w-10 h-10" />
              <span className="font-semibold text-gray-700">홍길동</span>
              <ChevronDown className="text-gray-500 w-4 h-4" />
            </button>

            {/* 프로필 드롭다운 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-60 bg-white shadow-lg rounded-xl border border-gray-100 py-5 z-50 animate-fadeIn">
                {[
                  { icon: Home, label: "홈", path: "/" },
                  { icon: User, label: "마이페이지", path: "/mypage" },
                  { icon: BookOpen, label: "내 학습", path: "/learn" },
                  { icon: Bookmark, label: "스크랩", path: "/scrap" },
                  { icon: Settings, label: "설정", path: "/settings" },
                ].map(({ icon: Icon, label, path }) => (
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
      </header>

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