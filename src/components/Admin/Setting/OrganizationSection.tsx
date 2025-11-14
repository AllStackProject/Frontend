import React, { useState } from "react";
import { Edit, Users, KeyRound, Building2, ImagePlus, Copy, Check, RefreshCcw, Settings } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import GroupCategoryModal from "@/components/admin/setting/GroupCategoryModal";
import { patchOrgImage, regenerateOrgCode } from "@/api/admin/orgInfo";
import { useAuth } from "@/context/AuthContext";

interface GroupCategory {
  name: string;
  categories: string[];
}

interface OrganizationInfo {
  id: number;
  name: string;
  image?: string;
  members: number;
  inviteCode: string;
  groups: GroupCategory[];
}

const OrganizationSection: React.FC = () => {
    const { orgName, orgId } = useAuth();

  const [organization, setOrganization] = useState<OrganizationInfo>({
    id: orgId || 0,
    name: orgName || "조직",
    image: "/dummy/woori-logo.png",
    members: 86,
    inviteCode: "123456",
    groups: [
      { name: "HR팀", categories: ["AI", "윤리"] },
      { name: "IT팀", categories: ["보안", "클라우드"] },
    ],
  });

  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 조직 이미지 수정 API 연동
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("이미지 파일 크기는 5MB 이하여야 합니다.");
      setShowErrorModal(true);
      return;
    }

    try {
      const preview = URL.createObjectURL(file);
      setOrganization((prev) => ({ ...prev, image: preview }));

      const res = await patchOrgImage(orgId||0, file); 
      if (res?.is_success) {
        // 서버가 이미지 URL 제공 시 반영
        // setOrganization((prev) => ({ ...prev, image: res.image_url }));
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setShowErrorModal(true);
    }
  };

  // 초대 메세지 
  const copyInviteMessage = () => {
    const inviteMessage = `${organization.name}에 참가해보세요!\n\n조직 초대 코드: ${organization.inviteCode}`;
    navigator.clipboard
      .writeText(inviteMessage)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => alert("복사에 실패했습니다."));
  };

  // 조직 코드 재발급 API
  const handleRegenerateClick = () => setShowRegenerateConfirm(true);

  const generateNewCode = async () => {
    try {
      const newCode = await regenerateOrgCode(orgId||0);
      setOrganization((prev) => ({ ...prev, inviteCode: newCode }));
      setShowRegenerateConfirm(false);
    } catch (err: any) {
      setErrorMessage(err.message);
      setShowErrorModal(true);
    }
  };

  return (
    <div>
      {/* 조직 정보 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 이미지 */}
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-32">
              <img
                src={organization.image || "/default-organization.png"}
                alt="Organization Logo"
                className="w-full h-full object-cover rounded-2xl border-2 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full p-2 shadow-lg cursor-pointer transition">
                <ImagePlus size={16} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* 정보 */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
              <Building2 size={22} className="text-blue-600" />
              {organization.name}
            </h2>

            {/* 멤버 */}
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">소속 멤버</p>
                <p className="text-lg font-bold text-gray-800">{organization.members}명</p>
              </div>
            </div>

            {/* 초대 코드 */}
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <KeyRound size={18} className="text-green-600" />
              </div>

              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">조직 초대 코드</p>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-mono bg-gray-100 px-4 py-2 rounded-lg text-lg font-bold border">
                    {organization.inviteCode}
                  </span>

                  <button
                    onClick={copyInviteMessage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      copied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "복사됨" : "초대 복사"}
                  </button>

                  <button
                    onClick={handleRegenerateClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCcw size={16} />
                    재생성
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 그룹 관리 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings size={18} className="text-blue-600" />
            그룹 및 카테고리 관리
          </h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
          >
            <Edit size={14} />
            수정
          </button>
        </div>

        {organization.groups.length > 0 ? (
          <div className="space-y-4">
            {organization.groups.map((group, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  {group.name}
                </h4>

                {group.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">등록된 카테고리 없음</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 border rounded-lg bg-gray-50">
            등록된 그룹이 없습니다.
          </div>
        )}
      </div>

      {/* 그룹 모달 */}
      {showModal && (
        <GroupCategoryModal
          groups={organization.groups}
          onClose={() => setShowModal(false)}
          onSubmit={(updated) =>
            setOrganization((prev) => ({ ...prev, groups: updated }))
          }
        />
      )}

      {/* 초대코드 재생성 확인 */}
      {showRegenerateConfirm && (
        <ConfirmActionModal
          title="초대 코드 재생성"
          message="조직 코드를 재생성하시겠습니까? 기존 코드는 즉시 무효화됩니다."
          keyword="재생성"
          confirmText="재생성"
          color="blue"
          onConfirm={generateNewCode}
          onClose={() => setShowRegenerateConfirm(false)}
        />
      )}

      {/* 이미지 에러 */}
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
    </div>
  );
};

export default OrganizationSection;