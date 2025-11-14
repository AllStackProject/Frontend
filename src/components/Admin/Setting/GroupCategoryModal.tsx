import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Users, Pencil } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

import {
  getCategories,
  addCategory,
  deleteCategory,
} from "@/api/admin/category";

import {
  addGroup,
  deleteGroupApi,
  updateGroup,
} from "@/api/admin/group";

import { useAuth } from "@/context/AuthContext";

interface GroupCategory {
  id: number;
  name: string;
  categories: { id: number; title: string }[];
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
  const { orgId } = useAuth();
  const [groupList, setGroupList] = useState<GroupCategory[]>(groups);

  // 그룹 삭제 모달
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GroupCategory | null>(null);

  // 그룹 이름 수정 상태
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 그룹 추가
  const [newGroup, setNewGroup] = useState("");

  const handleAddGroup = async () => {
    if (!newGroup.trim()) return;

    const res = await addGroup(orgId, newGroup.trim());
    if (res.is_success) {
      // 새로고침 없이 임시 추가
      setGroupList((prev) => [
        ...prev,
        { id: Date.now(), name: newGroup.trim(), categories: [] },
      ]);
      setNewGroup("");
    }
  };

  const openDeleteConfirm = (group: GroupCategory) => {
    setDeleteTarget(group);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteGroupApi(orgId, deleteTarget.id);

    setGroupList((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setShowConfirm(false);
  };

  const startEditing = (group: GroupCategory) => {
    setEditingGroupId(group.id);
    setEditingName(group.name);
  };

  const confirmEdit = async (group: GroupCategory) => {
    if (!editingName.trim()) return;

    await updateGroup(orgId, group.id, editingName.trim());

    setGroupList((prev) =>
      prev.map((g) =>
        g.id === group.id ? { ...g, name: editingName.trim() } : g
      )
    );
    setEditingGroupId(null);
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

          {/* 그룹 추가 */}
          <div className="p-6 flex gap-2 border-b">
            <input
              type="text"
              placeholder="새 그룹명 입력"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddGroup}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus size={16} /> 추가
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {groupList.map((group) => (
              <div key={group.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  {/* 그룹 이름 or 수정 입력 */}
                  {editingGroupId === group.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        onClick={() => confirmEdit(group)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      {group.name}
                    </h3>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEditing(group)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => openDeleteConfirm(group)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* 그룹 내 카테고리 */}
                <CategoryManager group={group} />
              </div>
            ))}
          </div>

          {/* 저장 버튼 */}
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm"
              onClick={() => {
                onSubmit(groupList);
                onClose();
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 그룹 삭제 모달 */}
      {showConfirm && deleteTarget && (
        <ConfirmActionModal
          title="그룹 삭제"
          message={`"${deleteTarget.name}" 그룹을 삭제하시겠습니까?\n해당 그룹의 카테고리도 함께 삭제됩니다.`}
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

/* ---------------------------------------------------------
   카테고리 관리 컴포넌트
--------------------------------------------------------- */
const CategoryManager = ({ group }: { group: GroupCategory }) => {
  const { orgId } = useAuth();
  const [categories, setCategories] = useState(group.categories);
  const [newCat, setNewCat] = useState("");

  const load = async () => {
    const list = await getCategories(orgId, group.id);
    setCategories(list);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!newCat.trim()) return;
    await addCategory(orgId, group.id, newCat.trim());
    setNewCat("");
    load();
  };

  const remove = async (catId: number) => {
    await deleteCategory(orgId, group.id, catId);
    load();
  };

  return (
    <div>
      {/* 카테고리 입력 */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="카테고리 입력"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          추가
        </button>
      </div>

      {/* 목록 */}
      <div className="flex flex-wrap gap-2">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <span
              key={cat.id}
              className="bg-green-50 border border-green-200 px-3 py-1 rounded-lg text-sm flex items-center gap-1 text-green-700"
            >
              {cat.title}
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => remove(cat.id)}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">카테고리가 없습니다.</p>
        )}
      </div>
    </div>
  );
};