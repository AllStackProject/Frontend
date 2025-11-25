import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { createOrganization, checkOrgNameAvailability } from "@/api/organization/orgs";

interface CreateOrgModalProps {
  onClose: () => void;
  refresh: () => Promise<void>;
  onSuccess?: (org: { id: number; name: string }) => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [nickname, setNickname] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [orgNameChecked, setOrgNameChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 이미지 업로드 */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        openModal({
          type: "error",
          title: "이미지 오류",
          message: "이미지 파일 크기는 5MB 이하여야 합니다.",
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
      openModal({
        type: "error",
        title: "입력 오류",
        message: "조직 이름을 입력해주세요.",
      });
      return;
    }

    try {
      const available = await checkOrgNameAvailability(orgName);

      if (available) {
        setOrgNameChecked(true);
        openModal({
          type: "success",
          title: "사용 가능",
          message: `"${orgName}" 은(는) 사용 가능한 조직명입니다.`,
        });
      } else {
        setOrgNameChecked(false);
        openModal({
          type: "error",
          title: "중복된 이름",
          message: `"${orgName}" 은(는) 이미 사용 중입니다.`,
        });
      }
    } catch (error: any) {
      openModal({
        type: "error",
        title: "오류 발생",
        message: error.message,
      });
    }
  };

  /** 조직 생성 */
  const handleCreateOrganization = async () => {
    if (!orgName.trim() || !nickname.trim()) {
      openModal({
        type: "error",
        title: "입력 오류",
        message: "조직 이름과 닉네임은 필수입니다.",
      });
      return;
    }

    if (!orgNameChecked) {
      openModal({
        type: "error",
        title: "확인 필요",
        message: "조직 이름 중복 확인을 진행해주세요.",
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

      openModal({
        type: "success",
        title: "조직 생성 성공",
        message: "조직이 성공적으로 생성되었습니다!",
        confirmText: "홈으로 이동",
        onConfirm: () => {
          navigate("/home");
        },
      });
    } catch (error: any) {
      openModal({
        type: "error",
        title: "조직 생성 실패",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-20"
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
                  src={imagePreview || ""}
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
    </>
  );
};

export default CreateOrgModal;