import React, { useState } from "react";
import { X, Edit3 } from "lucide-react";
import { useModal } from "@/context/ModalContext";

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


const EditNoticeModal: React.FC<EditNoticeModalProps> = ({
  notice,
  onClose,
  onSubmit,
}) => {
  const { openModal } = useModal();

  const [form, setForm] = useState({
    ...notice,
    selectedGroups: notice.selectedGroups || [],
  });

  const handleGroupToggle = (group: string) => {
    setForm((prev) => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(group)
        ? prev.selectedGroups.filter((g) => g !== group)
        : [...prev.selectedGroups, group],
    }));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      return openModal({
        type: "error",
        title: "입력 오류",
        message: "제목을 입력해주세요.",
        confirmText: "확인",
      });
    }

    if (form.visibility === "특정그룹공개" && form.selectedGroups.length === 0) {
      return openModal({
        type: "error",
        title: "입력 오류",
        message: "공개할 그룹을 최소 1개 이상 선택해주세요.",
        confirmText: "확인",
      });
    }

    // 확인 모달 (입력 키워드 필요)
    openModal({
      type: "edit",
      title: "공지 수정",
      message: `"${form.title}" 공지를 수정하시겠습니까?\n수정한 내용은 되돌릴 수 없습니다.`,
      requiredKeyword: "수정",
      confirmText: "수정",
      cancelText: "취소",
      onConfirm: confirmSave,
    });
  };

  const confirmSave = () => {
    onSubmit(form);
    openModal({
      type: "success",
      title: "수정 완료",
      message: "공지 수정이 성공적으로 완료되었습니다.",
      autoClose: true,
      autoCloseDelay: 1500,
    });
    onClose();
  };

  return (
    <>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                          className="w-4 h-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 rounded"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                  placeholder="공지 내용을 입력하세요"
                />
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
      </div>
    </>
  );
};

export default EditNoticeModal;