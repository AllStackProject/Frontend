import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Users, Settings, Check, Edit2 } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";

import {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/api/adminOrg/category";

import { addGroup, deleteGroupApi, fetchMemberGroups } from "@/api/adminOrg/group";
import { useAuth } from "@/context/AuthContext";

/* ---------------------------------------------------------
   타입 정의
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   ⭐ 메인 모달 컴포넌트
--------------------------------------------------------- */
const GroupCategoryModal: React.FC<GroupCategoryModalProps> = ({
  groups,
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const [groupList, setGroupList] = useState<GroupCategory[]>(groups);

  // 삭제 모달
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GroupCategory | null>(null);

  // 그룹 추가
  const [newGroup, setNewGroup] = useState("");

  /* ---------------------------------------------------------
     그룹 추가
  --------------------------------------------------------- */
  const handleAddGroup = async () => {
  if (!newGroup.trim()) return;

  try {
    const res = await addGroup(orgId || 0, newGroup.trim());
    if (!res?.is_success) {
      alert("그룹 추가 실패");
      return;
    }

    // 🔥 추가 후 서버에서 최신 목록 다시 불러옴
    const updated = await fetchMemberGroups(orgId || 0);

    setGroupList(updated);

    setNewGroup("");
  } catch (err: any) {
    alert(err.message || "그룹 추가 실패");
  }
};

  /* ---------------------------------------------------------
     그룹 삭제
  --------------------------------------------------------- */
  const openDeleteConfirm = (group: GroupCategory) => {
    setDeleteTarget(group);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteGroupApi(orgId || 0, deleteTarget.id);

      setGroupList((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setShowConfirm(false);
    } catch (err: any) {
      alert(err.message || "그룹 삭제 실패");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} className="text-blue-600" />
              그룹 및 카테고리 관리
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
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
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1 transition"
            >
              <Plus size={16} /> 추가
            </button>
          </div>

          {/* 본문 */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {groupList.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">생성된 그룹이 없습니다.</p>
                <p className="text-xs text-gray-400 mt-1">위에서 새 그룹을 추가해보세요.</p>
              </div>
            ) : (
              groupList.map((group) => (
                <div key={group.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Users size={16} className="text-blue-600" />
                      {group.name}
                    </h3>

                    <button
                      onClick={() => openDeleteConfirm(group)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="그룹 삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* 카테고리 관리 콜 */}
                  <CategoryManager group={group} />
                </div>
              ))
            )}
          </div>

          {/* 저장 */}
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-white transition"
            >
              취소
            </button>
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
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
   ⭐ CategoryManager (동일 파일 내 포함)
--------------------------------------------------------- */
const CategoryManager = ({ group }: { group: GroupCategory }) => {
  const { orgId } = useAuth();
  const [categories, setCategories] = useState(group.categories);
  const [newCat, setNewCat] = useState("");

  // 수정 상태
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const load = async () => {
    try {
      const list = await getCategories(orgId || 0, group.id);
      setCategories(list);
    } catch (err: any) {
      alert(err.message || "카테고리 조회 실패");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* 추가 */
  const add = async () => {
    if (!newCat.trim()) return;
    try {
      await addCategory(orgId || 0, group.id, newCat.trim());
      setNewCat("");
      load();
    } catch (err: any) {
      alert(err.message || "카테고리 추가 실패");
    }
  };

  /* 삭제 */
  const remove = async (catId: number) => {
    try {
      await deleteCategory(orgId || 0, group.id, catId);
      load();
    } catch (err: any) {
      alert(err.message || "카테고리 삭제 실패");
    }
  };

  /* 수정 시작 */
  const startEdit = (cat: { id: number; title: string }) => {
    setEditingCatId(cat.id);
    setEditingTitle(cat.title);
  };

  /* 수정 저장 */
  const confirmEdit = async (catId: number) => {
    if (!editingTitle.trim()) return;

    try {
      await updateCategory(orgId || 0, group.id, catId, editingTitle.trim());
      setEditingCatId(null);
      load();
    } catch (err: any) {
      alert(err.message || "카테고리 수정 실패");
    }
  };

  return (
    <div>
      {/* 입력 */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="카테고리 입력"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={add}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
        >
          <Plus size={14} /> 추가
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex flex-wrap gap-2">
        {categories.length === 0 ? (
          <p className="text-xs text-gray-400">카테고리가 없습니다.</p>
        ) : (
          categories.map((cat) => (
            <span
              key={cat.id}
              className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-sm"
            >
              {editingCatId === cat.id ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmEdit(cat.id)}
                    className="border border-green-300 px-2 py-1 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition"
                    onClick={() => confirmEdit(cat.id)}
                    title="저장"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition"
                    onClick={() => setEditingCatId(null)}
                    title="취소"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-700">
                    {cat.title}
                  </span>
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                    onClick={() => startEdit(cat)}
                    title="수정"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                    onClick={() => remove(cat.id)}
                    title="삭제"
                  >
                    <X size={14} />
                  </button>
                </>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  );
};