import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, ImagePlus } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import { createOrganization, checkOrgNameAvailability } from "@/api/organization/orgs";

interface CreateOrgModalProps {
  onClose: () => void;
  refresh: () => Promise<void>;
  onSuccess?: (org: { id: number; name: string }) => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({
  onClose,
  refresh,
  onSuccess,
}) => {
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [nickname, setNickname] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [orgNameChecked, setOrgNameChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalState, setModalState] = useState<null | {
    title: string;
    message: string;
    color?: "blue" | "red" | "yellow" | "green";
    confirmText?: string;
    onConfirm?: () => void;
  }>(null);

  /** 이미지 업로드 */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setModalState({
          title: "이미지 오류",
          message: "이미지 파일 크기는 5MB 이하여야 합니다.",
          color: "red",
          confirmText: "확인",
          onConfirm: () => setModalState(null),
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /** 조직명 중복 확인 */
  const handleCheckOrgName = async () => {
    if (!orgName.trim()) {
      setModalState({
        title: "입력 오류",
        message: "조직 이름을 입력해주세요.",
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setModalState(null),
      });
      return;
    }

    try {
      const available = await checkOrgNameAvailability(orgName);

      if (available) {
        setOrgNameChecked(true);
        setModalState({
          title: "사용 가능",
          message: `"${orgName}" 은(는) 사용 가능한 조직명입니다.`,
          color: "green",
          confirmText: "확인",
          onConfirm: () => setModalState(null),
        });
      } else {
        setOrgNameChecked(false);
        setModalState({
          title: "중복된 이름",
          message: `"${orgName}" 은(는) 이미 사용 중입니다.`,
          color: "red",
          confirmText: "확인",
          onConfirm: () => setModalState(null),
        });
      }
    } catch (error: any) {
      setModalState({
        title: "오류 발생",
        message: error.message,
        color: "red",
        confirmText: "확인",
        onConfirm: () => setModalState(null),
      });
    }
  };

  /** 조직 생성 */
  const handleCreateOrganization = async () => {
    if (!orgName.trim() || !nickname.trim()) {
      setModalState({
        title: "입력 오류",
        message: "조직 이름과 닉네임은 필수입니다.",
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setModalState(null),
      });
      return;
    }

    if (!orgNameChecked) {
      setModalState({
        title: "확인 필요",
        message: "조직 이름 중복 확인을 진행해주세요.",
        color: "yellow",
        confirmText: "확인",
        onConfirm: () => setModalState(null),
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", orgName);
      formData.append("desc", orgDesc);
      formData.append("nickname", nickname);
      if (imageFile) formData.append("img", imageFile);

      const res = await createOrganization(formData);

      setModalState({
        title: "조직 생성 성공",
        message: "조직이 성공적으로 생성되었습니다!",
        color: "green",
        confirmText: "홈으로 이동",
        onConfirm: () => {
          setModalState(null);

          // 상위로 전달 → 조직 선택 모달에서 selectOrganization 실행함
          onSuccess?.({ id: res.id, name: orgName });
        },
      });
    } catch (error: any) {
      setModalState({
        title: "생성 실패",
        message: error.message,
        color: "red",
        confirmText: "확인",
        onConfirm: () => setModalState(null),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-center mb-4">조직 생성</h2>

            {/* 조직 이미지 */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28">
                <img
                  src={imagePreview || "/default-organization.png"}
                  className="w-full h-full rounded-full object-cover border"
                />

                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                  <ImagePlus size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            {/* 입력 폼 */}
            <label className="block text-sm mb-1 font-medium">조직 이름 *</label>
            <div className="flex gap-2 mb-4">
              <input
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  setOrgNameChecked(false);
                }}
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="조직명을 입력하세요"
              />
              <button
                onClick={handleCheckOrgName}
                className="px-3 py-2 bg-primary text-white rounded-lg"
              >
                중복 확인
              </button>
            </div>

            <label className="block text-sm mb-1 font-medium">조직 설명</label>
            <textarea
              value={orgDesc}
              onChange={(e) => setOrgDesc(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="설명을 입력하세요"
              rows={3}
            />

            <label className="block text-sm mb-1 font-medium">닉네임 *</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="조직에서 사용할 닉네임"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 border rounded-lg">
                취소
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleCreateOrganization}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? "생성 중..." : "조직 생성"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {modalState &&
        createPortal(
          <ConfirmActionModal
            title={modalState.title}
            message={modalState.message}
            color={modalState.color}
            confirmText={modalState.confirmText}
            onConfirm={modalState.onConfirm!}
            onClose={() => setModalState(null)}
          />,
          document.body
        )}
    </>
  );
};

export default CreateOrgModal;