import React, { useState } from "react";
import { Edit, Users, Hash, KeyRound, Building2, ImagePlus, Copy, Check } from "lucide-react";
import EditOrganizationModal from "@/components/admin/setting/EditOrganizationModal";
import GroupManagementModal from "@/components/admin/setting/GroupManagementModal";
import HashtagModal from "@/components/admin/setting/HashtagModal";

interface OrganizationInfo {
  id: string;
  name: string;
  image?: string;
  members: number;
  inviteCode: string;
  hashtags: string[];
  groups: string[];
}

const OrganizationSection: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationInfo>({
    id: "ORG001",
    name: "우리 FISA",
    image: "/dummy/woori-logo.png",
    members: 86,
    inviteCode: "123456",
    hashtags: ["AI", "교육", "윤리"],
    groups: ["HR팀", "IT팀", "R&D팀"],
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showHashtagModal, setShowHashtagModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 초대 메시지 복사 함수
  const copyInviteMessage = () => {
    const inviteMessage = `${organization.name}에 참가해보세요!\n\n조직 초대 코드: ${organization.inviteCode}\n\n위 코드를 입력하여 조직에 참여하실 수 있습니다.`;
    
    navigator.clipboard.writeText(inviteMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert("복사에 실패했습니다.");
    });
  };

  return (
    <div>
      {/* 조직 기본 정보 카드 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 조직 이미지 */}
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-32">
              <img
                src={organization.image || "/default-organization.png"}
                alt="Organization Logo"
                className="w-full h-full object-cover rounded-2xl border-2 border-gray-200"
              />
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full p-2 shadow-lg transition-colors"
                title="이미지 변경"
              >
                <ImagePlus size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* 조직 정보 */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                <Building2 size={22} className="text-blue-600" />
                {organization.name}
              </h2>
              <p className="text-sm text-gray-500">조직 ID: {organization.id}</p>
            </div>

            {/* 멤버 수 */}
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <Users size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">소속 멤버</p>
                <p className="text-lg font-bold text-gray-800">
                  {organization.members.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600 ml-1">명</span>
                </p>
              </div>
            </div>

            {/* 초대 코드 */}
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                <KeyRound size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">조직 초대 코드</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-4 py-2 rounded-lg text-lg font-bold text-gray-800 tracking-wider border border-gray-300">
                    {organization.inviteCode}
                  </span>
                  <button
                    onClick={copyInviteMessage}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        복사완료
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        초대 메시지 복사
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 조직 정보 수정 버튼 */}
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit size={16} />
              조직 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 및 해시태그 관리 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 그룹 관리 */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                <Users size={18} className="text-blue-600" />
              </div>
              그룹 관리
            </h3>
            <button
              onClick={() => setShowGroupModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit size={14} />
              수정
            </button>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              등록된 그룹: <span className="font-semibold text-gray-800">{organization.groups.length}개</span>
            </p>
          </div>

          {organization.groups.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organization.groups.map((group, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Users size={14} />
                  {group}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              등록된 그룹이 없습니다.
            </div>
          )}
        </div>

        {/* 해시태그 관리 */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100">
                <Hash size={18} className="text-green-600" />
              </div>
              해시태그 관리
            </h3>
            <button
              onClick={() => setShowHashtagModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Edit size={14} />
              수정
            </button>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              등록된 해시태그: <span className="font-semibold text-gray-800">{organization.hashtags.length}개</span>
            </p>
          </div>

          {organization.hashtags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organization.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Hash size={14} />
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              등록된 해시태그가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 모달들 */}
      {showEditModal && (
        <EditOrganizationModal
          organization={organization}
          onClose={() => setShowEditModal(false)}
          onSubmit={(updated) => setOrganization(updated)}
        />
      )}

      {showGroupModal && (
        <GroupManagementModal
          groups={organization.groups}
          onClose={() => setShowGroupModal(false)}
          onSubmit={(updatedGroups) =>
            setOrganization((prev) => ({ ...prev, groups: updatedGroups }))
          }
        />
      )}

      {showHashtagModal && (
        <HashtagModal
          hashtags={organization.hashtags}
          onClose={() => setShowHashtagModal(false)}
          onSubmit={(updatedTags) =>
            setOrganization((prev) => ({ ...prev, hashtags: updatedTags }))
          }
        />
      )}
    </div>
  );
};

export default OrganizationSection;