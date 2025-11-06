import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, Plus, X } from "lucide-react";
import { getOrganizations } from "@/api/orgs/getOrg";
import { getUserInfo } from "@/api/mypage/getUserInfo";
import { useSelectOrganization } from "@/api/orgs/selectOrg";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import SuccessModal from "@/components/common/modals/SuccessModal";
import { joinOrganization } from "@/api/orgs/joinOrg";

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
  const [userName, setUserName] = useState<string>("");

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectOrganization } = useSelectOrganization();

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [orgCode, setOrgCode] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedOrgName, setAddedOrgName] = useState("");

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

  // 조직 선택
  const handleSelectOrg = async (orgId: number, orgName: string) => {
    try {
      const success = await selectOrganization(orgId, orgName);

    if (!success) {
      alert("조직 토큰 발급에 실패했습니다.");
      return;
    }

    navigate("/home", { replace: true })
    } catch (error: any) {
      alert(error.message || "조직 선택 중 오류가 발생했습니다.");
    }
  };

  // ✅ 조직 코드 입력 → 가입 신청 (TODO: /orgs/join API 연결 예정)
  const handleAddOrganization = async () => {
  if (!orgCode.trim()) {
    setErrorMessage("조직 코드를 입력해주세요.");
    setShowErrorModal(true);
    return;
  }

  // ✅ 영어 + 숫자 조합 6자리 검증
  if (orgCode.trim().length !== 6 || !/^[A-Za-z0-9]{6}$/.test(orgCode.trim())) {
    setErrorMessage("조직 코드는 영문과 숫자가 섞인 6자리여야 합니다.");
    setShowErrorModal(true);
    return;
  }

  try {
    // ✅ 조직 목록에서 일치하는 코드(또는 임시로 첫 조직)에 요청
    // 실제로는 code 기반으로 orgId를 백엔드가 판별해야 하지만,
    // 지금 구조에서는 테스트용으로 첫 조직을 사용합니다.
    const targetOrg = organizations[0];
    if (!targetOrg) {
      setErrorMessage("조직을 찾을 수 없습니다.");
      setShowErrorModal(true);
      return;
    }

    const success = await joinOrganization(targetOrg.id, orgCode);

    if (success) {
      // ✅ UI 반영 (PENDING 상태 추가)
      const newOrg: Organization = {
        id: targetOrg.id,
        name: targetOrg.name,
        memberCount: targetOrg.memberCount,
        image: targetOrg.image,
        joinStatus: "PENDING",
        isAdmin: false,
      };

      setOrganizations((prev) => [...prev, newOrg]);
      setAddedOrgName(newOrg.name);
      setShowAddModal(false);
      setOrgCode("");
      setShowSuccessModal(true);
    } else {
      throw new Error("조직 가입 요청이 실패했습니다.");
    }
  } catch (err: any) {
    setErrorMessage(err.message || "조직 가입 요청 중 오류가 발생했습니다.");
    setShowErrorModal(true);
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
                  className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${org.joinStatus === "PENDING"
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                    }`}
                >
                  {/* 상단 그라데이션 */}
                  <div className={`h-24 bg-gradient-to-br ${style.gradient} relative`}>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

                    {/* 조직 이미지 */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
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
                  <div className="pt-12 pb-4 px-4">
                    <h3 className="text-base font-bold text-gray-800 mb-1 text-center group-hover:text-gray-900 transition-colors">
                      {org.name}
                    </h3>

                    {org.memberCount && (
                      <p className="text-xs text-gray-500 text-center mb-2">
                        구성원 {org.memberCount.toLocaleString()}명
                      </p>
                    )}

                    {org.joinStatus === "PENDING" ? (
                      <p className="text-xs text-yellow-600 text-center mt-1">
                        승인 대기 중
                      </p>
                    ) : (
                      <div className={`flex items-center justify-center gap-2 text-xs font-semibold ${style.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        <span>입장하기</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* 조직 추가 버튼 */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-full flex flex-col items-center justify-center p-4 min-h-[220px]">
                <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors duration-300">
                  <Plus size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  조직 추가하기
                </h3>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  6자리 조직 코드로<br />새로운 조직에 참여하세요
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                조직 추가하기
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setOrgCode("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 Tip:</span> 조직 관리자에게 6자리 조직 코드를 받아 입력하세요.
                </p>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                조직 코드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orgCode}
                onChange={(e) =>
                  setOrgCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))
                }
                placeholder="A1B2C3"
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                {orgCode.length}/6 자리
              </p>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setOrgCode("");
                }}
                className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddOrganization}
                disabled={orgCode.length !== 6}
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                조직 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="입력 오류"
          message={errorMessage}
          confirmText="확인"
          color="red"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          title="조직 추가 완료"
          message={`"${addedOrgName}" 조직이 추가되었습니다!`}
          autoClose
          autoCloseDelay={2000}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
}