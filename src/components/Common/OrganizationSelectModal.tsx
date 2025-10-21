import { useState } from "react";
import { X, Plus } from "lucide-react";

interface OrganizationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (org: string) => void;
}

const OrganizationSelectModal = ({
  isOpen,
  onClose,
  onSelect,
}: OrganizationSelectModalProps) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  if (!isOpen) return null;

  const organizations = [
    { name: "우리 FISA", logo: "/woori-logo.png" },
    { name: "PASTA", logo: "/scrap-icon.png" },
    { name: "CODEMIND", logo: "/Lectures.png" },
    { name: "INNOV", logo: "/learn-icon.png" },
    { name: "NEXT EDU", logo: "/comments-icon.png" },
    { name: "WECON", logo: "/groups-icon.png" },
  ];

  const handleJoinOrganization = () => {
    if (!joinCode.trim()) {
      alert("조직 코드를 입력해주세요.");
      return;
    }

    // 여기에 실제 API 호출 로직 추가
    console.log("조직 가입 신청:", joinCode);
    alert(`조직 코드 "${joinCode}"로 가입 신청이 완료되었습니다.`);
    
    setJoinCode("");
    setShowJoinModal(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[480px] max-w-[90%] transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>

          {/* 제목 */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            다른 조직으로 접속
          </h2>

          {/* 조직 리스트 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center mb-6">
            {organizations.map((org, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(org.name);
                  onClose();
                }}
                className="flex flex-col items-center gap-3 cursor-pointer bg-gray-50 hover:bg-blue-50 rounded-xl py-4 px-3 transition-all duration-200 hover:shadow-md hover:scale-105 w-full"
              >
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                />
                <span className="text-gray-800 font-medium text-xs sm:text-sm text-center">
                  {org.name}
                </span>
              </div>
            ))}
          </div>

          {/* 조직 추가 버튼 */}
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <Plus size={20} />
            <span className="font-medium">조직 가입하기</span>
          </button>
        </div>
      </div>

      {/* 조직 가입 모달 */}
      {showJoinModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[60]"
          onClick={() => setShowJoinModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                조직 가입
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  조직 코드
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="조직 코드를 입력하세요 (예: FISA2024)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinOrganization();
                    }
                  }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  💡 조직 코드를 입력하면 관리자에게 가입 신청이 전송됩니다.
                  승인 후 조직에 참여할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleJoinOrganization}
                className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                가입 신청
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationSelectModal;