import React, { useState } from "react";
import { X, Edit3, FileText, AlertTriangle } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  visibility: "전체공개" | "특정그룹공개" | "비공개";
  content: string;
  selectedGroups?: string[];
  attachments?: string[];
  linkedVideo?: string;
}

interface EditNoticeModalProps {
  notice: Notice;
  onClose: () => void;
  onSubmit: (updated: Notice) => void;
}

// 조직의 그룹 목록
const ORGANIZATION_GROUPS = ["HR팀", "IT팀", "R&D팀", "기획팀", "마케팅팀"];

// 조직의 동영상 목록
const ORGANIZATION_VIDEOS = [
  { id: 1, title: "AI 트렌드 2025", uploader: "홍길동", uploadDate: "2025-10-10" },
  { id: 2, title: "딥러닝 기초 강의", uploader: "이영희", uploadDate: "2025-09-15" },
  { id: 3, title: "AI 윤리와 프라이버시", uploader: "박철수", uploadDate: "2025-08-21" },
  { id: 4, title: "R&D 워크샵", uploader: "이수현", uploadDate: "2025-10-01" },
  { id: 5, title: "AI 데이터 동의 안내", uploader: "최지훈", uploadDate: "2025-07-19" },
  { id: 6, title: "신규 서비스 소개", uploader: "관리자", uploadDate: "2025-10-20" },
  { id: 7, title: "직무 교육 1차", uploader: "박민지", uploadDate: "2025-09-28" },
];

const EditNoticeModal: React.FC<EditNoticeModalProps> = ({
  notice,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    ...notice,
    selectedGroups: notice.selectedGroups || [],
  });

  const [videoSearchQuery, setVideoSearchQuery] = useState("");
  const [showVideoResults, setShowVideoResults] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState(ORGANIZATION_VIDEOS);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

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

  const handleSave = () => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (form.visibility === "특정그룹공개" && form.selectedGroups.length === 0) {
      alert("공개할 그룹을 선택해주세요.");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    if (confirmInput === "수정") {
      onSubmit(form);
      setShowConfirmModal(false);
      setConfirmInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Edit3 size={20} className="text-yellow-600" />
            공지 수정
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                        className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/50 rounded"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                placeholder="공지 내용을 입력하세요"
              />
            </div>

            {/* 첨부파일 (읽기 전용) */}
            {form.attachments && form.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  첨부파일
                </label>
                <div className="space-y-2">
                  {form.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
                      <FileText size={16} className="text-blue-600" />
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
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            수정 완료
          </button>
        </div>
      </div>

      {/* 수정 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center mx-4">
            <AlertTriangle size={48} className="text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              정말 수정하시겠습니까?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              수정한 내용은 되돌릴 수 없습니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              수정하려면 아래 입력창에 <span className="font-bold text-gray-800">"수정"</span>을 입력하세요.
            </p>

            {/* 입력 필드 */}
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="수정"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmInput("");
                }}
                className="px-5 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmSave}
                disabled={confirmInput !== "수정"}
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  confirmInput === "수정"
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditNoticeModal;