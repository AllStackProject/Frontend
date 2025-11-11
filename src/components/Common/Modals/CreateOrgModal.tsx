import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import { createOrganization, checkOrgNameAvailability } from "@/api/orgs/createOrg";
import { getUserInfo } from "@/api/mypage/user";

interface CreateOrgModalProps {
  onClose: () => void;
  refresh: () => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ onClose, refresh }) => {
  const [nickname, setNickname] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // 조직명 관련 상태
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [nameMessageColor, setNameMessageColor] = useState<"red" | "green" | "gray">("gray");

  const [newOrgData, setNewOrgData] = useState({
    name: "",
    description: "",
    logoFile: null as File | null,
    logoPreview: "",
  });

  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    color: "blue" | "red" | "green" | "yellow";
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // ✅ 닉네임 기본값 (로그인 유저 이름)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setNickname(data.name || "");
      } catch (err) {
        console.error("🚨 사용자 정보 로드 실패:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  /** ✅ 조직명 중복 확인 */
  const handleCheckOrgName = async () => {
    if (!newOrgData.name.trim()) {
      setNameMessage("조직명을 입력해주세요.");
      setNameMessageColor("red");
      setIsNameAvailable(false);
      return;
    }

    try {
      setIsCheckingName(true);
      const available = await checkOrgNameAvailability(newOrgData.name);
      if (available) {
        setIsNameAvailable(true);
        setNameMessage(`"${newOrgData.name}"은(는) 사용 가능한 이름입니다.`);
        setNameMessageColor("green");
      } else {
        setIsNameAvailable(false);
        setNameMessage(`"${newOrgData.name}"은(는) 이미 존재하는 조직명입니다.`);
        setNameMessageColor("red");
      }
    } catch (err: any) {
      setIsNameAvailable(false);
      setNameMessage(err.message || "조직명 확인 중 오류가 발생했습니다.");
      setNameMessageColor("red");
    } finally {
      setIsCheckingName(false);
    }
  };

  /** ✅ 조직 생성 */
  const handleCreateOrganization = async () => {
    if (!isNameAvailable) {
      setConfirmModal({
        title: "확인 필요",
        message: "조직명 중복 확인을 먼저 해주세요.",
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setConfirmModal(null),
      });
      return;
    }

    if (!newOrgData.logoFile || !newOrgData.description.trim() || !nickname.trim()) {
      setConfirmModal({
        title: "입력 필요",
        message: "모든 필수 항목을 입력해야 합니다.",
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setConfirmModal(null),
      });
      return;
    }

    try {
      // ✅ FormData 구성
      const formData = new FormData();
      formData.append("name", newOrgData.name);
      formData.append("desc", newOrgData.description);
      formData.append("nickname", nickname);
      formData.append("img", newOrgData.logoFile);

      const res = await createOrganization(formData);

      if (res.success) {
        setConfirmModal({
          title: "조직 생성 완료",
          message: `"${newOrgData.name}" 조직이 성공적으로 생성되었습니다.`,
          color: "green",
          confirmText: "확인",
          onConfirm: () => {
            setConfirmModal(null);
            setTimeout(() => {
              refresh();
              onClose();
            }, 150);
          },
        });
      }
    } catch (err: any) {
      setConfirmModal({
        title: "생성 실패",
        message: err.message || "조직 생성 중 오류가 발생했습니다.",
        color: "red",
        confirmText: "닫기",
        onConfirm: () => setConfirmModal(null),
      });
    }
  };

  // ✅ 버튼 활성화 조건
  const isCreateEnabled =
    isNameAvailable &&
    !!newOrgData.logoFile &&
    !!newOrgData.description.trim() &&
    !!nickname.trim();

  return createPortal(
    <>
      {/* 메인 모달 */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
          {/* 헤더 */}
          <div className="relative mb-4">
            <h3 className="text-lg font-semibold text-text-primary text-center">조직 생성</h3>
            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-text-muted hover:text-text-primary"
            >
              <X size={20} />
            </button>
          </div>

          {/* 본문 */}
          <div className="space-y-5">
            {/* 조직명 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직명 *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOrgData.name}
                  onChange={(e) => {
                    setNewOrgData({ ...newOrgData, name: e.target.value });
                    setIsNameAvailable(false);
                    setNameMessage("");
                  }}
                  placeholder="조직명을 입력하세요"
                  className="flex-1 border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={handleCheckOrgName}
                  disabled={!newOrgData.name.trim() || isCheckingName}
                  className={`px-3 py-2 text-sm rounded-lg text-white whitespace-nowrap ${
                    !newOrgData.name.trim() || isCheckingName
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary hover:bg-primary-light"
                  }`}
                >
                  {isCheckingName ? "확인 중..." : "중복 확인"}
                </button>
              </div>

              {nameMessage && (
                <p
                  className={`text-xs mt-1 ${
                    nameMessageColor === "red"
                      ? "text-red-600"
                      : nameMessageColor === "green"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {nameMessage}
                </p>
              )}
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직 이미지 *
              </label>
              <div className="flex items-center gap-3">
                {newOrgData.logoPreview ? (
                  <img
                    src={newOrgData.logoPreview}
                    alt="조직 이미지 미리보기"
                    className="w-16 h-16 rounded-lg object-cover border border-border-light"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-text-muted text-xs border border-border-light">
                    미리보기
                  </div>
                )}
                <label className="cursor-pointer px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-light transition">
                  이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setNewOrgData({
                          ...newOrgData,
                          logoFile: file,
                          logoPreview: previewURL,
                        });
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직 설명 *
              </label>
              <textarea
                value={newOrgData.description}
                onChange={(e) =>
                  setNewOrgData({ ...newOrgData, description: e.target.value })
                }
                placeholder="조직에 대한 설명을 입력하세요"
                rows={3}
                className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직에서 사용할 닉네임 *
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={isLoadingUser}
                placeholder={isLoadingUser ? "로딩 중..." : "닉네임을 입력하세요"}
                className="w-full border border-border-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
              />
              {!isLoadingUser && (
                <p className="text-xs text-gray-500 mt-1">
                  초기값은 회원가입 시 이름이며, 자유롭게 수정 가능합니다.
                </p>
              )}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              onClick={handleCreateOrganization}
              disabled={!isCreateEnabled}
              className={`px-4 py-2 text-sm rounded-lg text-white transition ${
                isCreateEnabled
                  ? "bg-primary hover:bg-primary-light"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              생성하기
            </button>
          </div>
        </div>
      </div>

      {/* ConfirmActionModal */}
      {confirmModal && (
        <ConfirmActionModal
          title={confirmModal.title}
          message={confirmModal.message}
          color={confirmModal.color}
          confirmText={confirmModal.confirmText}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>,
    document.body
  );
};

export default CreateOrgModal;