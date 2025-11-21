import { useState, useEffect } from "react";
import { X, Plus, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
import { getOrganizations } from "@/api/organization/orgs";
import { useSelectOrganization } from "@/api/organization/orgs";
import CreateOrgModal from "@/components/common/modals/CreateOrgModal";
import JoinOrgModal from "@/components/common/modals/JoinOrgModal";
import { useModal } from "@/context/ModalContext";
import { useNavigate } from "react-router-dom";

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
  const { openModal } = useModal();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organizations, setOrganizations] = useState<
    { id: number; name: string; img_url?: string; join_status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectOrganization } = useSelectOrganization();
  const navigate = useNavigate();

  // 조직 목록 불러오기
  useEffect(() => {
    if (!isOpen) return;
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const data = await getOrganizations();
        setOrganizations(
          data.map((org: any) => ({
            id: org.id,
            name: org.name,
            img_url: org.img_url,
            join_status: org.join_status,
          }))
        );
      } catch (err: any) {
        setError(err.message || "조직 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizations();
  }, [isOpen]);

  // 조직 선택
  const handleSelectOrg = async (orgId: number, orgName: string, status: string) => {
    if (status === "PENDING") {
      openModal({
        type: "error",
        title: "승인 대기 중",
        message: " 승인 대기 중인 조직입니다.",
      });
      return;
    }

    try {
      const isSuccess = await selectOrganization(orgId, orgName);
      if (!isSuccess) {
        openModal({
          type: "confirm",
          title: "가입 요청 완료",
          message: `"${orgName}" 조직에 가입 요청이 접수되었습니다.`,
        });
        return;
      }
      onSelect(orgName);
      onClose();
      window.location.reload();
    } catch (error: any) {
      openModal({
        type: "error",
        title: "오류 발생",
        message: error.message || "조직 전환 중 오류가 발생했습니다.",
      });
    }
  };

  // 상태 뱃지 렌더 함수
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-1">
            <CheckCircle size={12} />
            <span>활성</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-1 text-yellow-600 text-xs font-medium mt-1">
            <Clock size={12} />
            <span>승인 대기중</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-1">
            <XCircle size={12} />
            <span>거절됨</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 모달 시작 */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[480px] max-w-[90%]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            다른 조직으로 접속
          </h2>

          {/* 조직 목록 */}
          {loading ? (
            <p className="text-center text-gray-500 py-8">조직 목록을 불러오는 중...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : organizations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              아직 소속된 조직이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center mb-6">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id, org.name, org.join_status)}
                  className={`flex flex-col items-center gap-2 cursor-pointer rounded-xl py-4 px-3 transition-all duration-200 hover:shadow-md hover:scale-105 w-full ${org.join_status === "PENDING"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-blue-50"
                    }`}
                >
                  <img
                    src={org.img_url || "/dummy/woori-logo.png"}
                    alt={org.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                  />
                  <div className="text-center">
                    <p className="text-gray-800 font-medium text-xs sm:text-sm">
                      {org.name}
                    </p>
                    {renderStatusBadge(org.join_status)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition"
            >
              <Plus size={20} />
              <span className="font-medium">조직 가입하기</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-500 hover:bg-green-50 transition"
            >
              <Building2 size={20} />
              <span className="font-medium">조직 생성하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 조직 가입 모달 */}
      {showJoinModal && (
        <JoinOrgModal
          onClose={() => setShowJoinModal(false)}
          refresh={async () => {
            const data = await getOrganizations();
            setOrganizations(
              data.map((org: any) => ({
                id: org.id,
                name: org.name,
                img_url: org.img_url,
                join_status: org.join_status,
              }))
            );
          }}
          onSuccess={async (createdOrg) => {
            try {
              const data = await getOrganizations();
              setOrganizations(
                data.map((org: any) => ({
                  id: org.id,
                  name: org.name,
                  img_url: org.img_url,
                  join_status: org.join_status,
                }))
              );

              openModal({
                type: "success",
                title: "가입 요청 완료",
                message: `"${createdOrg?.name}" 조직에 가입 요청이 접수되었습니다.`,
                confirmText: "확인",
              });
            } finally {
              setShowJoinModal(false);
            }
          }}
        />
      )}

      {/* 조직 생성 모달 */}
      {showCreateModal && (
        <CreateOrgModal
          onClose={() => setShowCreateModal(false)}
          refresh={async () => {
            const data = await getOrganizations();
            setOrganizations(
              data.map((org: any) => ({
                id: org.id,
                name: org.name,
                img_url: org.img_url,
                join_status: org.join_status,
              }))
            );
          }}
          onSuccess={async (org) => {
            try {
              // 1) 새 조직 자동 선택 (org_token 발급)
              const isSuccess = await selectOrganization(org.id, org.name);

              if (!isSuccess) {
                openModal({
                  type: "error",
                  title: "선택 실패",
                  message: "조직 토큰 발급에 실패했습니다.",
                });
                return;
              }

              // 조직 선택 모달 닫기
              onClose();
              // 2) 홈 이동
              navigate("/home");
            } catch (error: any) {
              openModal({
                type: "error",
                title: "오류 발생",
                message: error.message,
              });
            } finally {
              setShowCreateModal(false);
            }
          }}
        />
      )}
    </>
  );
};

export default OrganizationSelectModal;