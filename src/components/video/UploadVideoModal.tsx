import React, { useState } from "react";
import { X, Upload, Image, Calendar, Hash, FileVideo, Users } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

interface UploadVideoModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// 더미 조직 데이터 
const ORG_HASHTAGS = ["AI", "교육", "보안", "신입교육", "테크"];
const ORG_GROUPS = ["HR팀", "IT팀", "기획팀", "R&D팀", "디자인팀"];

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null as File | null,
    thumbnailPreview: "",
    hashtags: [] as string[],
    visibility: "organization",
    selectedGroups: [] as string[],
    allowComments: true,
    enableQuiz: false,
    aiConsent: false,
    expiration: "none",
    customDate: "",
    videoFile: null as File | null,
    videoInfo: null as { name: string; size: string; type: string } | null,
  });

  // 에러 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 상태 업데이트 헬퍼
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 해시태그 / 그룹 토글
  const toggleItem = (listKey: "hashtags" | "selectedGroups", item: string) => {
    setFormData((prev) => {
      const list = prev[listKey];
      return {
        ...prev,
        [listKey]: list.includes(item)
          ? list.filter((t) => t !== item)
          : [...list, item],
      };
    });
  };

  // 파일 크기 표시
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 만료 버튼 클릭 시 날짜 자동 계산
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

  const handleSubmit = () => {
    // 필수 항목 검증
    if (!formData.title.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      setShowErrorModal(true);
      return;
    }

    if (!formData.videoFile) {
      setErrorMessage("동영상 파일을 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    if (!formData.thumbnail) {
      setErrorMessage("썸네일 이미지를 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    // AI 퀴즈 활성화 시 동의 여부 확인
    if (formData.enableQuiz && !formData.aiConsent) {
      setErrorMessage("AI 퀴즈 생성을 위해서는 AI 데이터 사용에 동의해야 합니다.");
      setShowErrorModal(true);
      return;
    }

    // 특정 그룹 공개 시 그룹 선택 확인
    if (formData.visibility === "group" && formData.selectedGroups.length === 0) {
      setErrorMessage("공개할 그룹을 최소 1개 이상 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    onSubmit(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">새 동영상 업로드</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={22} />
            </button>
          </div>

          {/* 스크롤 가능한 컨텐츠 */}
          <div className="overflow-y-auto px-6 py-5">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 왼쪽: 파일 관련 */}
              <div className="space-y-6">
                {/* 동영상 업로드 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">동영상 파일 *</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition">
                    <Upload size={28} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 px-4 text-center">
                      {formData.videoFile ? formData.videoFile.name : "파일을 선택하거나 드래그"}
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleChange("videoFile", file);
                          handleChange("videoInfo", {
                            name: file.name,
                            size: formatFileSize(file.size),
                            type: file.type,
                          });
                        }
                      }}
                    />
                  </label>

                  {/* 파일 정보 */}
                  {formData.videoInfo && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <FileVideo size={18} className="text-blue-600" />
                        <span className="font-medium text-gray-800">{formData.videoInfo.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 pl-6">
                        크기: {formData.videoInfo.size} | 형식: {formData.videoInfo.type}
                      </p>
                    </div>
                  )}
                </div>

                {/* 썸네일 업로드 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    썸네일 이미지 * (1280×720)
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

              {/* 오른쪽: 설정 관련 */}
              <div className="space-y-5">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="영상 제목을 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="영상에 대한 설명을 입력하세요"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  />
                </div>

                {/* 해시태그 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">해시태그</label>
                  <div className="flex flex-wrap gap-2">
                    {ORG_HASHTAGS.map((tag) => {
                      const active = formData.hashtags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleItem("hashtags", tag)}
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-1 transition ${
                            active
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">공개 범위</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleChange("visibility", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="organization">조직 전체공개</option>
                    <option value="private">비공개</option>
                    <option value="group">특정 그룹만 공개</option>
                  </select>

                  {/* 그룹 다중 선택 */}
                  {formData.visibility === "group" && (
                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 mb-2">그룹 선택 *</label>
                      <div className="flex flex-wrap gap-2">
                        {ORG_GROUPS.map((group) => {
                          const active = formData.selectedGroups.includes(group);
                          return (
                            <button
                              key={group}
                              onClick={() => toggleItem("selectedGroups", group)}
                              type="button"
                              className={`px-3 py-1.5 text-sm rounded-full border flex items-center gap-1 transition ${
                                active
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
                    </div>
                  )}
                </div>

                {/* 댓글 허용 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">댓글 허용</span>
                  <button
                    type="button"
                    onClick={() => handleChange("allowComments", !formData.allowComments)}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      formData.allowComments ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        formData.allowComments ? "translate-x-6" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* AI 퀴즈 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">AI 퀴즈 생성</span>
                    <button
                      type="button"
                      onClick={() => handleChange("enableQuiz", !formData.enableQuiz)}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        formData.enableQuiz ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          formData.enableQuiz ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 동영상 업로드 후 AI 퀴즈 여부를 수정할 수 없습니다.
                  </p>
                </div>

                {formData.enableQuiz && (
                  <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-800 mb-2">
                      ⚠️ AI 퀴즈 생성을 위해 영상 일부 데이터가 AI 학습용으로 일시적으로 사용될 수 있습니다.
                    </p>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.aiConsent}
                        onChange={(e) => handleChange("aiConsent", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">AI 데이터 사용에 동의합니다.</span>
                    </label>
                  </div>
                )}

                {/* 만료 기간 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">영상 만료 기간</label>
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
                        className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                          formData.expiration === value
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
                      value={formData.customDate}
                      onChange={(e) => handleChange("customDate", e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              onClick={handleSubmit}
              type="button"
              className="px-5 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              업로드
            </button>
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="업로드 입력 오류"
          message={errorMessage}
          confirmText="확인"
          color="red"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default UploadVideoModal;