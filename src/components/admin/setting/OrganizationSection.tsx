import React, { useState, useEffect } from "react";
import {
  Edit,
  Users,
  KeyRound,
  Building2,
  ImagePlus,
  Copy,
  Check,
  RefreshCcw,
  Settings,
  Save,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";
import GroupCategoryModal from "@/components/admin/setting/GroupCategoryModal";
import { patchOrgImage, regenerateOrgCode } from "@/api/adminOrg/info";
import { useAuth } from "@/context/AuthContext";
import { fetchOrgInfo } from "@/api/adminOrg/info";

interface GroupCategory {
  id: number;
  name: string;
  categories: { id: number; title: string }[];
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
  const { orgId } = useAuth();
  const { openModal } = useModal();

  const [organization, setOrganization] = useState<OrganizationInfo>({
    id: orgId || 0,
    name: "",
    image: "",
    members: 0,
    inviteCode: "",
    groups: [],
  });

  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  /* ---------------------------------------------------------
  조직 정보 + 그룹 조회
--------------------------------------------------------- */
  useEffect(() => {
    const loadOrgInfo = async () => {
      try {
        const response = await fetchOrgInfo(orgId || 0);

        setOrganization({
          id: orgId || 0,
          name: response.org_name,
          image: response.img_url,
          members: response.member_cnt,
          inviteCode: response.org_code,
          groups: response.member_groups.map((g: any) => ({
            id: g.id,
            name: g.name,
            categories: g.categories ?? [],
          })),
        });

      } catch (e) {
        console.error("❌ 조직 정보 로딩 실패:", e);
      }
    };

    if (orgId) {
      loadOrgInfo();
    }
  }, [orgId]);

  /* ---------------------------------------------------------
    이미지 선택 (미리보기)
  --------------------------------------------------------- */
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      openModal({
        type: "error",
        title: "이미지 오류",
        message: "이미지 파일 크기는 5MB 이하여야 합니다.",
      });
      return;
    }

    setSelectedImageFile(file);

    const preview = URL.createObjectURL(file);
    setOrganization((prev) => ({ ...prev, image: preview }));
  };

  /* ---------------------------------------------------------
    이미지 저장 (API 호출)
  --------------------------------------------------------- */
  const handleSaveImage = async () => {
    if (!selectedImageFile) {
      openModal({
        type: "error",
        title: "변경할 이미지 선택",
        message: "변경할 이미지가 없습니다. 먼저 이미지를 선택해주세요.",
      });
      return;
    }

    try {
      const res = await patchOrgImage(orgId || 0, selectedImageFile);

      if (res?.is_success) {
        // 서버에서 최종 이미지 URL을 내려준다면 여기서 적용 가능
        // setOrganization(prev => ({ ...prev, image: res.image_url }));
        openModal({
          type: "confirm",
          title: "이미지 저장 성공",
          message: "이미지 저장에 성공했습니다.",
        });
      }
    } catch (err: any) {
      openModal({
        type: "error",
        title: "이미지 저장 실패",
        message: err.message || "이미지 저장 중 오류가 발생했습니다.",
      });
    }
  };

  /* ---------------------------------------------------------
    초대 메세지 복사
  --------------------------------------------------------- */
  const copyInviteMessage = async () => {
    const inviteMessage = `${organization.name}에 참가해보세요!\n\n조직 초대 코드: ${organization.inviteCode}`;

    try {
      // 현대적 API 우선 시도
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteMessage);

      } else {
        // HTTPS가 아니거나 clipboard API 차단된 경우 fallback
        const textarea = document.createElement("textarea");
        textarea.value = inviteMessage;
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const success = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!success) throw new Error("execCommand copy failed");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // 최종 실패
      openModal({
        type: "error",
        title: "복사 실패",
        message: "초대메세지를 복사할 수 없습니다. HTTPS 환경인지 확인해주세요.",
      });
    }
  };

  /* ---------------------------------------------------------
    조직 코드 재발급
  --------------------------------------------------------- */

  const regenerateCodeApi = async () => {
    try {
      const newCode = await regenerateOrgCode(orgId || 0);
      setOrganization((prev) => ({ ...prev, inviteCode: newCode }));

      openModal({
        type: "success",
        title: "재생성 완료",
        message: "조직 코드가 성공적으로 재생성되었습니다.",
        autoClose: true,
      });
    } catch (err: any) {
      openModal({
        type: "error",
        title: "재생성 실패",
        message: err.message || "조직 코드 재생성 중 오류가 발생했습니다.",
      });
    }
  };
  const handleRegenerateCode = () => {
    openModal({
      type: "confirm",
      title: "초대 코드 재생성",
      message: "조직 코드를 재생성하시겠습니까?\n기존 코드는 즉시 무효화됩니다.",
      confirmText: "재생성",
      onConfirm: regenerateCodeApi,   // API만 실행
    });
  };


  /* ---------------------------------------------------------
       모달 닫기 → 그룹 목록 최신화
    --------------------------------------------------------- */
  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div>
      {/* 조직 정보 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* 이미지 영역 */}
          <div className="relative flex-shrink-0 flex flex-col items-center">
            {/* 이미지 박스 */}
            <div className="relative w-32 h-32">
              <img
                src={organization.image}
                alt="Organization Logo"
                className="w-full h-full object-cover rounded-2xl border-2 border-gray-200 shadow-sm"
              />

              {/* 이미지 선택 버튼 (우측 하단) */}
              <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 border-2 border-white rounded-full p-1.5 shadow-lg cursor-pointer transition">
                <ImagePlus size={14} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectImage}
                />
              </label>
            </div>

            {/* 이미지 저장 버튼 */}
            <button
              onClick={handleSaveImage}
              className="mt-3 flex items-center gap-1 px-3 py-1.5 bg-blue-700 text-white text-xs rounded-md shadow-sm hover:bg-blue-600 transition"
            >
              <Save size={12} />
              저장
            </button>
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
                <p className="text-lg font-bold text-gray-800">
                  {organization.members}명
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

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-mono bg-gray-100 px-4 py-2 rounded-lg text-lg font-bold border">
                    {organization.inviteCode}
                  </span>

                  <button
                    onClick={copyInviteMessage}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${copied
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "복사됨" : "초대메세지 복사"}
                  </button>

                  <button
                    onClick={handleRegenerateCode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                  >
                    <RefreshCcw size={12} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organization.groups.map((group) => (
              <div
                key={group.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  {group.name}
                </h4>

                {group.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
                      >
                        {cat.title}
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
          onClose={handleCloseModal}
          onSubmit={(updated) =>
            setOrganization((prev) => ({ ...prev, groups: updated }))
          }
        />
      )}
    </div>
  );
};

export default OrganizationSection;