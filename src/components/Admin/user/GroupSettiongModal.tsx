import React, { useState } from "react";
import { X, Layers } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import { updateMemberGroups } from "@/api/admin/members";
import { useAuth } from "@/context/AuthContext";

interface GroupSettingModalProps {
  user: { id: number; name: string; email: string; groups: string[] };
  availableGroups: string[];
  onClose: () => void;
  onSubmit: (updatedGroups: string[]) => void;
}

const GroupSettingModal: React.FC<GroupSettingModalProps> = ({
  user,
  availableGroups,
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const [selectedGroups, setSelectedGroups] = useState<string[]>(user.groups || []);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!orgId) {
      alert("조직 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setSaving(true);

      // 그룹 이름을 ID로 변환 (임시 - 실제로는 availableGroups에 id가 포함되어야 함)
      // TODO: availableGroups를 { id: number, name: string }[] 형태로 변경
      const groupIds = selectedGroups.map((_, idx) => idx + 1); // 임시 매핑
      
      // API 호출
      const success = await updateMemberGroups(orgId, user.id, groupIds);

      if (success) {
        alert("✅ 그룹이 성공적으로 변경되었습니다.");
        onSubmit(selectedGroups);
        setShowConfirmModal(false);
        onClose();
      } else {
        alert("⚠️ 그룹 변경에 실패했습니다.");
      }
    } catch (error: any) {
      alert(error.message || "그룹 변경 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers size={20} className="text-green-600" />
              그룹 설정
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
          <div className="p-6 space-y-4">
            {/* 사용자 정보 */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">그룹을 변경할 사용자</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* 그룹 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                소속 그룹 선택
              </label>
              
              {availableGroups.length === 0 ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    생성된 그룹이 없습니다.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    조직 설정에서 그룹을 먼저 생성해주세요.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableGroups.map((group) => (
                    <label
                      key={group}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group)}
                        onChange={() => toggleGroup(group)}
                        className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 rounded"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {group}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 선택된 그룹 표시 */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                선택된 그룹: {selectedGroups.length}개
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedGroups.length === 0 ? (
                  <span className="text-xs text-gray-500">선택된 그룹이 없습니다</span>
                ) : (
                  selectedGroups.map((group, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    >
                      {group}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleSaveClick}
              disabled={saving || availableGroups.length === 0}
              className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "그룹 저장"}
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 저장 확인 모달 */}
      {showConfirmModal && (
        <ConfirmActionModal
          title="그룹 변경"
          message={`"${user.name}"님의 소속 그룹을 변경하시겠습니까?\n선택된 그룹: ${selectedGroups.length}개`}
          keyword="저장"
          confirmText="저장"
          color="green"
          onConfirm={handleConfirmSave}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default GroupSettingModal;