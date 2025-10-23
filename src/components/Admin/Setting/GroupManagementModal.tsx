import React, { useState } from "react";
import { X, Plus, Trash2, Users } from "lucide-react";

interface GroupManagementModalProps {
  groups: string[];
  onClose: () => void;
  onSubmit: (updated: string[]) => void;
}

const GroupManagementModal: React.FC<GroupManagementModalProps> = ({
  groups,
  onClose,
  onSubmit,
}) => {
  const [newGroup, setNewGroup] = useState("");
  const [groupList, setGroupList] = useState(groups);

  const addGroup = () => {
    if (!newGroup.trim()) return;

    if (groupList.includes(newGroup.trim())) {
      alert("이미 존재하는 그룹명입니다.");
      return;
    }

    setGroupList((prev) => [...prev, newGroup.trim()]);
    setNewGroup("");
  };

  const removeGroup = (name: string) => {
    if (window.confirm(`"${name}" 그룹을 삭제하시겠습니까?`)) {
      setGroupList((prev) => prev.filter((g) => g !== name));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addGroup();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            그룹 관리
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
          {/* 현재 상태 표시 */}
          <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  등록된 그룹 수
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  조직 내 총 그룹 개수
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {groupList.length}
                </div>
                <div className="text-xs text-gray-500">
                  개 그룹
                </div>
              </div>
            </div>
          </div>

          {/* 입력 필드 */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              새 그룹 추가
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="그룹명을 입력하세요"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                <Plus size={16} /> 추가
              </button>
            </div>
          </div>

          {/* 그룹 목록 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              등록된 그룹 목록 ({groupList.length})
            </label>
            {groupList.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {groupList.map((g, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {g}
                      </span>
                    </div>
                    <button
                      onClick={() => removeGroup(g)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                등록된 그룹이 없습니다.
              </div>
            )}
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
            onClick={() => {
              onSubmit(groupList);
              onClose();
            }}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupManagementModal;