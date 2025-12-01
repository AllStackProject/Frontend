import React, { useEffect, useState } from "react";
import { X, FileText, AlertCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { createAdminNotice } from "@/api/adminNotice/notice";
import { fetchOrgInfo } from "@/api/adminOrg/info";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface CreateNoticeModalProps {
  onClose: () => void;
  onSubmit: () => void; 
}

interface GroupItem {
  id: number;
  name: string;
}

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const { openModal } = useModal();

  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "전체공개" as "전체공개" | "특정그룹공개" | "비공개",
    selectedGroupIds: [] as number[],
  });

  /** 그룹 조회 */
  useEffect(() => {
    if (!orgId) return;

    const loadGroups = async () => {
      try {
        const data = await fetchOrgInfo(orgId);
        setGroups(data.member_groups || []);
      } catch (err) {
        console.error(err);
        openModal({
          type: "error",
          title: "그룹 조회 실패",
          message: "조직의 그룹 정보를 불러올 수 없습니다.",
        });
      } finally {
        setLoadingGroups(false);
      }
    };

    loadGroups();
  }, [orgId]);

  /** 에러 모달 공용 */
  const showError = (msg: string) =>
    openModal({
      type: "error",
      title: "공지 입력 오류",
      message: msg,
      confirmText: "확인",
    });

  /** 체크박스 토글 */
  const toggleGroup = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedGroupIds: prev.selectedGroupIds.includes(id)
        ? prev.selectedGroupIds.filter((g) => g !== id)
        : [...prev.selectedGroupIds, id],
    }));
  };

  /** 등록 Submit */
  const handleSubmit = async () => {
    if (!form.title.trim()) return showError("제목을 입력해주세요.");
    if (!form.content.trim()) return showError("내용을 입력해주세요.");

    if (form.visibility === "특정그룹공개" && form.selectedGroupIds.length === 0) {
      return showError("공개할 그룹을 최소 1개 이상 선택해주세요.");
    }

    const open_scope =
      form.visibility === "전체공개"
        ? "PUBLIC"
        : form.visibility === "비공개"
        ? "PRIVATE"
        : "GROUP";

    try {
      const success = await createAdminNotice(orgId!, {
        title: form.title,
        content: form.content,
        open_scope,
        member_groups: form.selectedGroupIds,
      });

      if (success) {
        openModal({
          type: "success",
          title: "등록 완료",
          message: "새 공지가 성공적으로 등록되었습니다.",
          autoClose: true,
        });

        onSubmit(); 
        onClose();
      }
    } catch (err: any) {
      showError(err.message || "공지 등록 실패");
    }
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
            >
              <X size={22} />
            </button>
          </div>

          {/* 안내 메세지 */}
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200 flex items-center gap-2 text-yellow-800 text-sm">
            <AlertCircle size={18} />
            <span className="font-medium">
              등록된 공지는 수정 불가합니다. 삭제만 가능합니다.
            </span>
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
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibility: e.target.value as any,
                      selectedGroupIds: [],
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="전체공개">전체공개</option>
                  <option value="특정그룹공개">특정그룹공개</option>
                  <option value="비공개">비공개</option>
                </select>
              </div>

              {/* 특정 그룹 */}
              {form.visibility === "특정그룹공개" && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    공개할 그룹 선택 <span className="text-red-500">*</span>
                  </label>

                  {loadingGroups ? (
                    <LoadingSpinner text="로딩 중..." />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {groups.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={form.selectedGroupIds.includes(g.id)}
                            onChange={() => toggleGroup(g.id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{g.name}</span>
                        </label>
                      ))}
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
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                  placeholder="공지 내용을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 하단 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm border border-gray-300 rounded-lg"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-sm bg-primary text-white rounded-lg"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNoticeModal;