import { X } from "lucide-react";

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
  if (!isOpen) return null;

  const organizations = [
    { name: "우리 FISA", logo: "/woori-logo.png" },
    { name: "PASTA", logo: "/woori-logo.png" },
    { name: "CODEMIND", logo: "/woori-logo.png" },
    { name: "INNOV", logo: "/woori-logo.png" },
    { name: "NEXT EDU", logo: "/woori-logo.png" },
    { name: "WECON", logo: "/woori-logo.png" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-8 w-[480px] max-w-[90%] transition-all duration-300"
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
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center"
          style={{ gridAutoRows: "minmax(120px, auto)" }}
        >
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
                className="w-14 h-14 rounded-full object-cover shadow-sm"
              />
              <span className="text-gray-800 font-medium text-sm text-center">
                {org.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelectModal;