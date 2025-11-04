import React, { useState } from "react";
import { X, UploadCloud, FileText, Trash2, FilePlay } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

interface NoticeFormData {
  title: string;
  content: string;
  visibility: "전체공개" | "특정그룹공개" | "비공개";
  selectedGroups: string[];
  author: string;
  attachments: File[];
  linkedVideo?: string;
}

interface CreateNoticeModalProps {
  onClose: () => void;
  onSubmit: (notice: any) => void;
}

// 조직의 그룹 목록
const ORGANIZATION_GROUPS = ["HR팀", "IT팀", "R&D팀", "기획팀", "마케팅팀"];

// 조직의 동영상 목록 (더미 데이터)
const ORGANIZATION_VIDEOS = [
  { id: 1, title: "AI 트렌드 2025", uploader: "홍길동", uploadDate: "2025-10-10" },
  { id: 2, title: "딥러닝 기초 강의", uploader: "이영희", uploadDate: "2025-09-15" },
  { id: 3, title: "AI 윤리와 프라이버시", uploader: "박철수", uploadDate: "2025-08-21" },
  { id: 4, title: "R&D 워크샵", uploader: "이수현", uploadDate: "2025-10-01" },
  { id: 5, title: "AI 데이터 동의 안내", uploader: "최지훈", uploadDate: "2025-07-19" },
  { id: 6, title: "신규 서비스 소개", uploader: "관리자", uploadDate: "2025-10-20" },
  { id: 7, title: "직무 교육 1차", uploader: "박민지", uploadDate: "2025-09-28" },
];

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<NoticeFormData>({
    title: "",
    content: "",
    visibility: "전체공개",
    selectedGroups: [],
    author: "관리자",
    attachments: [],
    linkedVideo: "",
  });

  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [showVideoResults, setShowVideoResults] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState(ORGANIZATION_VIDEOS);

  // 에러 및 확인 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleGroupToggle = (group: string) => {
    setForm((prev) => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(group)
        ? prev.selectedGroups.filter((g) => g !== group)
        : [...prev.selectedGroups, group],
    }));
  };

  const handleVideoSearch = () => {
    const results = ORGANIZATION_VIDEOS.filter((video) =>
      video.title.toLowerCase().includes(videoSearchQuery.toLowerCase())
    );
    setFilteredVideos(results);
    setShowVideoResults(true);
  };

  const handleVideoSelect = (video: typeof ORGANIZATION_VIDEOS[0]) => {
    setForm((prev) => ({ ...prev, linkedVideo: video.title }));
    setShowVideoResults(false);
    setVideoSearchQuery("");
  };

  const handleSubmit = () => {
    // 제목 검증
    if (!form.title.trim()) {
      setErrorMessage("제목을 입력해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 내용 검증
    if (!form.content.trim()) {
      setErrorMessage("내용을 입력해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 특정 그룹 공개 시 그룹 선택 검증
    if (form.visibility === "특정그룹공개" && form.selectedGroups.length === 0) {
      setErrorMessage("공개할 그룹을 최소 1개 이상 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    const newNotice = {
      id: Date.now(),
      title: form.title,
      author: form.author,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      visibility: form.visibility,
      selectedGroups: form.selectedGroups,
      content: form.content,
      attachments: form.attachments.map((f) => f.name),
      linkedVideo: form.linkedVideo,
    };

    onSubmit(newNotice);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              새 공지 등록
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X size={22} />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-5">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="공지 제목을 입력하세요"
                />
              </div>

              {/* 공개 범위 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  공개 범위 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.visibility}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      visibility: e.target.value as any,
                      selectedGroups: [],
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="전체공개">전체공개</option>
                  <option value="특정그룹공개">특정그룹공개</option>
                  <option value="비공개">비공개</option>
                </select>
              </div>

              {/* 특정 그룹 선택 */}
              {form.visibility === "특정그룹공개" && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    공개할 그룹 선택 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ORGANIZATION_GROUPS.map((group) => (
                      <label
                        key={group}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={form.selectedGroups.includes(group)}
                          onChange={() => handleGroupToggle(group)}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{group}</span>
                      </label>
                    ))}
                  </div>
                  {form.selectedGroups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">선택된 그룹:</p>
                      <div className="flex flex-wrap gap-1">
                        {form.selectedGroups.map((group) => (
                          <span
                            key={group}
                            className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                          >
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 내용 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="공지 내용을 입력하세요"
                />
              </div>

              {/* 첨부파일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  첨부파일
                </label>
                <div className="space-y-2">
                  <label className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    <UploadCloud size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-600">파일 업로드</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {form.attachments.length > 0 && (
                    <div className="space-y-2">
                      {form.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-700 truncate flex-1">
                            {file.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 연결 동영상 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  연결할 동영상 (선택)
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="동영상 제목으로 검색"
                      value={videoSearchQuery}
                      onChange={(e) => setVideoSearchQuery(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleVideoSearch}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                    >
                      검색
                    </button>
                  </div>

                  {/* 검색 결과 */}
                  {showVideoResults && (
                    <div className="border border-gray-200 rounded-lg bg-white max-h-48 overflow-y-auto">
                      {filteredVideos.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {filteredVideos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => handleVideoSelect(video)}
                              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                form.linkedVideo === video.title
                                  ? "bg-blue-50 border-l-2 border-blue-600"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {video.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    업로더: {video.uploader} | {video.uploadDate}
                                  </p>
                                </div>
                                {form.linkedVideo === video.title && (
                                  <span className="text-blue-600 text-xs font-semibold">
                                    선택됨
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-sm text-gray-500">
                          검색 결과가 없습니다.
                        </div>
                      )}
                    </div>
                  )}

                  {/* 선택된 동영상 */}
                  {form.linkedVideo && (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FilePlay size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-800">
                          {form.linkedVideo}
                        </span>
                      </div>
                      <button
                        onClick={() => setForm({ ...form, linkedVideo: "" })}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              등록
            </button>
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="공지 입력 오류"
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

export default CreateNoticeModal;