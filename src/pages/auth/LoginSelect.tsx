import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, Plus } from "lucide-react";
import { getOrganizations } from "@/api/organization/orgs";
import { getUserInfo } from "@/api/user/userInfo";
import { useSelectOrganization } from "@/api/organization/orgs";
import { useModal } from "@/context/ModalContext";
import CreateOrgModal from "@/components/common/modals/CreateOrgModal";
import JoinOrgModal from "@/components/common/modals/JoinOrgModal";

interface Organization {
  id: number;
  name: string;
  image?: string;
  memberCount?: number;
  joinStatus: "ACTIVE" | "PENDING";
  isAdmin: boolean;
}

export default function LoginSelect() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [userName, setUserName] = useState<string>("");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectOrganization } = useSelectOrganization();

  // 모달 상태
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 유저 정보 & 조직 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await getUserInfo();
        setUserName(user.name);

        const orgs = await getOrganizations();
        const formatted = orgs.map((org: any) => ({
          id: org.id,
          name: org.name,
          image: org.img_url || "/dummy/woori-logo.png",
          memberCount: 0,
          joinStatus: org.join_status,
          isAdmin: org.is_admin,
        }));
        setOrganizations(formatted);
      } catch (err: any) {
        console.error("❌ [LoginSelect] 데이터 로드 실패:", err);
        setError(err.message || "데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 조직 목록 새로고침
  const refreshOrganizations = async () => {
    try {
      const orgs = await getOrganizations();
      const formatted = orgs.map((org: any) => ({
        id: org.id,
        name: org.name,
        image: org.img_url || "/dummy/woori-logo.png",
        memberCount: 0,
        joinStatus: org.join_status,
        isAdmin: org.is_admin,
      }));
      setOrganizations(formatted);
    } catch (err) {
      console.error("조직 목록 새로고침 실패:", err);
    }
  };

  // 조직 선택
  const handleSelectOrg = async (orgId: number, orgName: string) => {
    try {
      const success = await selectOrganization(orgId, orgName);

      if (!success) {

        openModal({
  type: "error",
  title: "오류 발생",
  message: "조직 토큰 발급에 실패했습니다.",
});
        return;
      }

      navigate("/home", { replace: true });
    } catch (error: any) {
      openModal({
  type: "error",
  title: "오류 발생",
  message: error.message || "조직 선택 중 오류가 발생했습니다."
});
    }
  };

  // 색상 관련
  const availableColors = [
    "blue",
    "purple",
    "green",
    "orange",
    "red",
    "indigo",
    "pink",
    "teal",
  ];

  const colorStyles: Record<string, any> = {
    blue: { gradient: "from-blue-500 to-blue-600", text: "text-blue-600" },
    purple: { gradient: "from-purple-500 to-purple-600", text: "text-purple-600" },
    green: { gradient: "from-green-500 to-green-600", text: "text-green-600" },
    orange: { gradient: "from-orange-500 to-orange-600", text: "text-orange-600" },
    red: { gradient: "from-red-500 to-red-600", text: "text-red-600" },
    indigo: { gradient: "from-indigo-500 to-indigo-600", text: "text-indigo-600" },
    pink: { gradient: "from-pink-500 to-pink-600", text: "text-pink-600" },
    teal: { gradient: "from-teal-500 to-teal-600", text: "text-teal-600" },
  };

  const getRandomColor = (id: number) => {
    const hash = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return availableColors[hash % availableColors.length];
  };

  const getColorStyle = (orgId: number) => {
    const color = getRandomColor(orgId);
    return colorStyles[color] || colorStyles.blue;
  };

  // 로딩 & 에러 처리
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        조직 목록 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* 헤더 */}
          <div className="text-center mb-12 mt-12">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-3">
              {userName}님 반갑습니다! 👋
            </h1>
            <p className="text-lg text-gray-600">어느 조직으로 접속할까요?</p>
          </div>

          {/* 조직 선택 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizations.map((org) => {
              const style = getColorStyle(org.id);

              return (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org.id, org.name)}
                  disabled={org.joinStatus === "PENDING"}
                  className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${org.joinStatus === "PENDING" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  {/* 상단 그라데이션 */}
                  <div className={`h-28 bg-gradient-to-br ${style.gradient} relative`}>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

                    {/* 조직 이미지 */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.name}
                            className="w-16 h-16 rounded-full object-contain p-2"
                          />
                        ) : (
                          <span className={`text-2xl font-bold ${style.text}`}>
                            {org.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 조직 정보 */}
                  <div className="pt-14 pb-4 px-4 bg-white rounded-b-2xl">
                    <h3 className="text-base font-bold text-gray-800 mb-1 text-center group-hover:text-gray-900 transition-colors">
                      {org.name}
                    </h3>

                    {org.joinStatus === "PENDING" ? (
                      <p className="text-xs text-yellow-600 text-center mt-1">승인 대기 중</p>
                    ) : (
                      <div
                        className={`flex items-center justify-center gap-2 text-xs font-semibold ${style.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        <span>입장하기</span>
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* 조직 가입 버튼 */}
            <button
              onClick={() => setShowJoinModal(true)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-full flex flex-col items-center justify-center p-4 min-h-[220px]">
                <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors duration-300">
                  <Plus
                    size={32}
                    className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  조직 가입하기
                </h3>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  조직 코드로
                  <br />
                  새로운 조직에 참여하세요
                </p>
              </div>
            </button>

            {/* 조직 생성 버튼 */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-full flex flex-col items-center justify-center p-4 min-h-[220px]">
                <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors duration-300">
                  <Plus
                    size={32}
                    className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  조직 생성하기
                </h3>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  내 조직을
                  <br />
                  생성해보세요
                </p>
              </div>
            </button>
          </div>

          {/* 안내 */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              참여한 조직이 보이지 않으면 관리자에게 문의하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {/* 조직 가입 모달 */}
      {showJoinModal && (
        <JoinOrgModal
          onClose={() => setShowJoinModal(false)}
          refresh={refreshOrganizations}
          onSuccess={(nickname) => {
            openModal({
              type: "success",
              title: "가입 신청 완료!",
              message: `"${nickname}" 님의 가입 신청이 완료되었습니다.`,
              autoClose: true,
              autoCloseDelay: 2000,
            });
          }}
        />
      )}

      {/* 조직 생성 모달 */}
      {showCreateModal && (
        <CreateOrgModal
          onClose={() => setShowCreateModal(false)}
          refresh={refreshOrganizations}
        />
      )}
    </>
  );
}