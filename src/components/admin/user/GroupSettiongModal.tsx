import React, { useState } from "react";
import { X, Layers } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { updateMemberGroups } from "@/api/adminSuper/members";
import { useAuth } from "@/context/AuthContext";

interface Group {
  id: number;
  name: string;
}

interface GroupSettingModalProps {
  user: {
    id: number;
    name: string;
    email: string;
    groups: Group[];
  };
  availableGroups: Group[];
  onClose: () => void;
  onSubmit: (updatedGroups: Group[]) => void;
}

const GroupSettingModal: React.FC<GroupSettingModalProps> = ({
  user,
  availableGroups,
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const { openModal } = useModal();
  const [saving, setSaving] = useState(false);
  // 멤버 현재 그룹 → ID 배열로 저장
  const [selectedGroups, setSelectedGroups] = useState<number[]>(
    user.groups.map((g) => g.id)
  );

  /* ---------------------------------------------------------
      그룹 토글
  --------------------------------------------------------- */
  const toggleGroup = (groupId: number) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSaveClick = () => {
    openModal({
      type: "confirm",
      title: "그룹 변경",
      message: `"${user.name}"님의 그룹을 변경하시겠습니까?\n선택된 그룹 ${selectedGroups.length}개`,
      requiredKeyword: "저장",
      confirmText: "저장",
      onConfirm: handleConfirmSave,
    });
  };

  /* ---------------------------------------------------------
      그룹 저장 실행 → API 호출
  --------------------------------------------------------- */
  const handleConfirmSave = async () => {
    if (!orgId) {
      openModal({
        type: "error",
        title: "조직 정보 오류",
        message: "조직 정보를 찾을 수 없습니다.",
      });
      return;
    }
    
    try {
      setSaving(true);

      const success = await updateMemberGroups(orgId, user.id, selectedGroups);

      if (success) {
        // 저장된 그룹 목록을 객체 배열로 변환하여 부모로 전달
        const updated = availableGroups.filter((g) => selectedGroups.includes(g.id));

        onSubmit(updated);
        onClose();
      }
    } catch (err: any) {
      openModal({
        type: "error",
        title: "그룹 저장 실패",
        message: err.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">

          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers size={20} className="text-green-600" />
              그룹 설정
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 space-y-4">
            {/* 멤버 정보 */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">그룹을 변경할 멤버</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* 그룹 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                소속 그룹 선택
              </label>

              {availableGroups.length === 0 ? (
                <div className="p-4 bg-gray-50 border rounded-lg text-center">
                  생성된 그룹이 없습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableGroups.map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                        className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 rounded"
                      />

                      <span className="text-sm font-medium text-gray-800">
                        {group.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 그룹 표시 */}
            <div className="p-3 bg-gray-50 border rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                선택된 그룹: {selectedGroups.length}개
              </p>

              <div className="flex flex-wrap gap-2">
                {selectedGroups.map((id) => {
                  const g = availableGroups.find((gr) => gr.id === id);
                  return (
                    <span
                      key={id}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    >
                      {g?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <button className="px-5 py-2 border rounded-lg" onClick={onClose}>
              취소
            </button>
            <button
              onClick={handleSaveClick}
              disabled={saving}
              className="px-5 py-2 bg-green-600 text-white rounded-lg"
            >
              {saving ? "저장 중..." : "그룹 저장"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupSettingModal;