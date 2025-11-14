import React, { useState } from "react";
import { X, Plus, Trash2, Users } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

interface GroupCategory {
  name: string;
  categories: string[];
}

interface GroupCategoryModalProps {
  groups: GroupCategory[];
  onClose: () => void;
  onSubmit: (updated: GroupCategory[]) => void;
}

const GroupCategoryModal: React.FC<GroupCategoryModalProps> = ({
  groups,
  onClose,
  onSubmit,
}) => {
  const [groupList, setGroupList] = useState<GroupCategory[]>(groups);
  const [newGroup, setNewGroup] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<string | null>(null);

  const addGroup = () => {
    if (!newGroup.trim()) return;
    if (groupList.find((g) => g.name === newGroup.trim())) return;
    setGroupList((prev) => [...prev, { name: newGroup.trim(), categories: [] }]);
    setNewGroup("");
  };

  const deleteGroup = (name: string) => {
    setDeletingGroup(name);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingGroup) {
      setGroupList((prev) =>
        prev.filter((g) => g.name !== deletingGroup)
      );
      setDeletingGroup(null);
      setShowConfirm(false);
    }
  };

  const addCategory = (groupName: string, newCat: string) => {
    if (!newCat.trim()) return;
    setGroupList((prev) =>
      prev.map((g) =>
        g.name === groupName
          ? {
              ...g,
              categories: Array.from(
                new Set([...g.categories, newCat.trim()])
              ),
            }
          : g
      )
    );
  };

  const removeCategory = (groupName: string, cat: string) => {
    setGroupList((prev) =>
      prev.map((g) =>
        g.name === groupName
          ? {
              ...g,
              categories: g.categories.filter((c) => c !== cat),
            }
          : g
      )
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users size={20} className="text-blue-600" />
              그룹 및 카테고리 관리
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* 그룹 추가 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="새 그룹명 입력"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGroup()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addGroup}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={16} /> 그룹 추가
              </button>
            </div>

            {/* 그룹 목록 */}
            {groupList.length > 0 ? (
              <div className="space-y-4">
                {groupList.map((group, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        {group.name}
                      </h3>
                      <button
                        onClick={() => deleteGroup(group.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* 카테고리 추가 */}
                    <CategoryManager
                      group={group}
                      addCategory={addCategory}
                      removeCategory={removeCategory}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                등록된 그룹이 없습니다.
              </div>
            )}
          </div>

          {/* 하단 */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white"
            >
              취소
            </button>
            <button
              onClick={() => {
                onSubmit(groupList);
                onClose();
              }}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 삭제 확인 */}
      {showConfirm && deletingGroup && (
        <ConfirmActionModal
          title="그룹 삭제"
          message={`"${deletingGroup}" 그룹을 삭제하시겠습니까?\n해당 그룹의 모든 카테고리도 함께 삭제됩니다.`}
          keyword="삭제"
          confirmText="삭제"
          color="red"
          onConfirm={confirmDelete}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default GroupCategoryModal;

/* 하위 컴포넌트: 그룹 내 카테고리 관리 */
const CategoryManager = ({
  group,
  addCategory,
  removeCategory,
}: {
  group: { name: string; categories: string[] };
  addCategory: (groupName: string, newCat: string) => void;
  removeCategory: (groupName: string, cat: string) => void;
}) => {
  const [newCat, setNewCat] = useState("");

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder={`${group.name}의 새 카테고리`}
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory(group.name, newCat)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => {
            addCategory(group.name, newCat);
            setNewCat("");
          }}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
        >
          <Plus size={16} /> 추가
        </button>
      </div>

      {group.categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {group.categories.map((cat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-lg"
            >
              {cat}
              <button
                onClick={() => removeCategory(group.name, cat)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">등록된 카테고리가 없습니다.</p>
      )}
    </div>
  );
};