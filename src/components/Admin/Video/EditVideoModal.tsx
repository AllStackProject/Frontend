import React, { useState } from "react";
import {
  X,
  Image,
  Calendar,
  Hash,
  FileVideo,
  Users,
  Brain,
} from "lucide-react";
import ConfirmActionModal from "@/components/Common/Modals/ConfirmActionModal";

interface EditVideoModalProps {
  video: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ORG_HASHTAGS = ["AI", "교육", "보안", "신입교육", "테크"];
const ORG_GROUPS = ["HR팀", "IT팀", "기획팀", "R&D팀", "디자인팀"];

const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    ...video,
    thumbnailPreview: video.thumbnail || "",
  });

  const [showCommentAlert, setShowCommentAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: typeof formData) => ({ ...prev, [key]: value }));
  };

  const toggleItem = (key: "hashtags" | "selectedGroups", item: string) => {
    setFormData((prev: typeof formData) => {
      const list = prev[key] || [];
      return {
        ...prev,
        [key]: list.includes(item)
          ? list.filter((t: string) => t !== item)
          : [...list, item],
      };
    });
  };

  const handleExpirationSelect = (value: string) => {
    handleChange("expiration", value);

    if (value === "7" || value === "30") {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(value));
      const formatted = targetDate.toISOString().split("T")[0];
      handleChange("customDate", formatted);
    } else if (value === "none") {
      handleChange("customDate", "");
    }
  };

  // 파일 용량 포맷
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">동영상 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* 상단 안내 */}
        <div className="bg-amber-50 border-b border-amber-200 text-sm text-amber-800 px-6 py-3">
          ⚠️ 제목, 동영상 파일 정보, AI 퀴즈 생성 여부는 수정할 수 없습니다.
          <br />
          🚨 댓글 기능을 OFF로 변경하면 기존 댓글이 모두 삭제됩니다.
        </div>

        {/* 콘텐츠 */}
        <div className="overflow-y-auto px-6 py-5">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 왼쪽 */}
            <div className="space-y-6">
              {/* 동영상 파일 정보 (수정 불가) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  동영상 파일 정보
                </label>
                <div className="border border-gray-200 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <FileVideo size={16} />
                    <span className="font-medium">{formData.videoFile?.name || "파일명 미등록"}</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-6">
                    용량: {formatFileSize(formData.videoFile?.size)} | 형식:{" "}
                    {formData.videoFile?.type || "—"}
                  </p>
                </div>
              </div>

              {/* 썸네일 변경 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  썸네일 이미지 (1280×720)
                </label>

                <div className="flex flex-col gap-2">
                  {/* 썸네일 미리보기 영역 */}
                  <label className="w-full aspect-video border-2 border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-400 transition overflow-hidden">
                    {formData.thumbnailPreview ? (
                      <img
                        src={formData.thumbnailPreview}
                        alt="썸네일 미리보기"
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Image size={32} className="mb-1" />
                        <span className="text-sm">이미지를 선택하세요</span>
                        <span className="text-xs text-gray-400">(권장: 1280×720)</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setFormData((prev: typeof formData) => ({
                            ...prev,
                            thumbnail: file,
                            thumbnailPreview: preview,
                          }));
                        }
                      }}
                    />
                  </label>

                  {/* 제거 버튼 */}
                  {formData.thumbnail && (
                    <button
                      onClick={() =>
                        setFormData((prev: typeof formData) => ({
                          ...prev,
                          thumbnail: null,
                          thumbnailPreview: "",
                        }))
                      }
                      className="text-xs text-gray-500 underline hover:text-red-500 self-end transition"
                    >
                      썸네일 제거
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽 */}
            <div className="space-y-5">
              {/* 제목 (수정 불가) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  설명
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* 해시태그 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  해시태그
                </label>
                <div className="flex flex-wrap gap-2">
                  {ORG_HASHTAGS.map((tag) => {
                    const active = formData.hashtags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleItem("hashtags", tag)}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-1 transition ${active
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                          }`}
                      >
                        <Hash size={14} />
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 공개 범위 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  공개 범위
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="organization">조직 전체공개</option>
                  <option value="private">비공개</option>
                  <option value="group">특정 그룹만 공개</option>
                </select>

                {formData.visibility === "group" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ORG_GROUPS.map((group) => {
                      const active = formData.selectedGroups?.includes(group);
                      return (
                        <button
                          key={group}
                          onClick={() => toggleItem("selectedGroups", group)}
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-1 transition ${active
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                            }`}
                        >
                          <Users size={14} />
                          {group}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 댓글 허용 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">댓글 허용</span>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.allowComments) {
                      setShowCommentAlert(true);
                    } else {
                      handleChange("allowComments", true);
                    }
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.allowComments ? "bg-blue-500" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${formData.allowComments ? "translate-x-6" : ""
                      }`}
                  />
                </button>
              </div>

              {/* AI 퀴즈 생성 (수정 불가 표시) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  AI 퀴즈 생성 여부
                </label>
                <div className="flex items-center gap-3 border border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-lg px-4 py-2">
                  <Brain size={16} />
                  <span>
                    {formData.enableQuiz ? "ON (활성화됨)" : "OFF (비활성화됨)"}
                  </span>
                </div>
              </div>

              {/* 영상 만료 기간 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  영상 만료 기간
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {[
                    { label: "7일 뒤", value: "7" },
                    { label: "30일 뒤", value: "30" },
                    { label: "만료 없음", value: "none" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleExpirationSelect(value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition ${formData.expiration === value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={formData.customDate || ""}
                    onChange={(e) => handleChange("customDate", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition"
          >
            취소
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            type="button"
            className="px-5 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            수정 저장
          </button>
        </div>
      </div>

      {/* 댓글 OFF 경고 모달 */}
      {showCommentAlert && (
        <ConfirmActionModal
          title="댓글 기능 비활성화"
          message="댓글 기능을 비활성화하시겠습니까? 기존 댓글은 모두 삭제됩니다."
          color="red"
          confirmText="확인"
          onConfirm={() => {
            handleChange("allowComments", false);
            setShowCommentAlert(false);
          }}
          onClose={() => setShowCommentAlert(false)}
        />
      )}

      {/* 수정 확인 모달 */}
      {showConfirmModal && (
        <ConfirmActionModal
          title="수정 확인"
          message="정말 수정하시겠습니까? 수정한 내용은 되돌릴 수 없습니다."
          keyword="수정"
          confirmText="확인"
          color="blue"
          onConfirm={() => {
            onSubmit(formData);
            setShowConfirmModal(false);
            onClose();
          }}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default EditVideoModal;