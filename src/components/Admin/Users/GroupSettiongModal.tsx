import React, { useState } from "react";
import { X, Users, Info } from "lucide-react";
import ConfirmActionModal from "@/components/Common/Modals/ConfirmActionModal";

interface GroupSettingModalProps {
  user: { id: string; name: string; email: string; groups: string[] };
  availableGroups: string[];
  onClose: () => void;
  onSubmit: (groups: string[]) => void;
}

const GroupSettingModal: React.FC<GroupSettingModalProps> = ({
  user,
  availableGroups,
  onClose,
  onSubmit,
}) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(user.groups);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    onSubmit(selectedGroups);
    setShowConfirmModal(false);
    onClose();
  };

  // 외부 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
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
          <div className="p-6 overflow-y-auto flex-1">
            {/* 사용자 정보 */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">그룹을 변경할 사용자</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>

            {/* 현재 소속 그룹 표시 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                현재 소속 그룹
              </label>
              {selectedGroups.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {selectedGroups.map((group) => (
                    <span
                      key={group}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">소속된 그룹이 없습니다.</p>
                </div>
              )}
            </div>

            {/* 그룹 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                그룹 선택 <span className="text-xs text-gray-500 font-normal">(복수 선택 가능)</span>
              </label>

              {availableGroups.length > 0 ? (
                <div className="space-y-2">
                  {availableGroups.map((group) => {
                    const isSelected = selectedGroups.includes(group);

                    return (
                      <label
                        key={group}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleGroup(group)}
                          className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {group}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-sm text-gray-600">
                    선택 가능한 그룹이 없습니다.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    관리자가 그룹을 먼저 생성해야 합니다.
                  </p>
                </div>
              )}
            </div>

            {/* 안내 메시지 */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">그룹 설정 안내</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>한 사용자는 여러 그룹에 소속될 수 있습니다.</li>
                    <li>그룹 변경은 즉시 적용되며, 해당 그룹의 콘텐츠 접근 권한이 변경됩니다.</li>
                  </ul>
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
              onClick={handleSaveClick}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              그룹 저장
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 저장 확인 모달 */}
      {showConfirmModal && (
        <ConfirmActionModal
          title="그룹 저장"
          message={`"${user.name}"님의 그룹을 변경하시겠습니까?\n그룹 변경은 즉시 적용되며, 콘텐츠 접근 권한이 변경됩니다.`}
          keyword="저장"
          confirmText="저장"
          color="blue"
          onConfirm={handleConfirmSave}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </>
  );
};

export default GroupSettingModal;