import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Users, Settings, Check, Edit2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";

import {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/api/adminOrg/category";

import { addGroup, deleteGroupApi } from "@/api/adminOrg/group";
import { fetchOrgInfo } from "@/api/adminOrg/info";
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
  const { openModal } = useModal();
  const [groupList, setGroupList] = useState<GroupCategory[]>(groups);
  const [newGroup, setNewGroup] = useState("");

  /* ---------------------------------------------------------
     📌 서버에서 최신 그룹 목록 다시 불러오는 함수
  --------------------------------------------------------- */
  const refreshGroups = async () => {
    try {
      const info = await fetchOrgInfo(orgId || 0);

      const mapped: GroupCategory[] = (info.member_groups || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        categories: g.categories ?? [],
      }));

      setGroupList(mapped);
    } catch (err: any) {
      console.error("❌ 그룹 목록 갱신 실패:", err);
    }
  };

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

      await refreshGroups(); // 🔥 서버 최신 목록 반영
      setNewGroup("");
    } catch (err: any) {
      alert(err.message || "그룹 추가 실패");
    }
  };

  /* ---------------------------------------------------------
     그룹 삭제
  --------------------------------------------------------- */
  const openDeleteConfirm = (group: GroupCategory) => {
    openModal({
      type: "delete",
      title: "그룹 삭제",
      message: `"${group.name}" 그룹을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      requiredKeyword: "삭제",
      confirmText: "삭제",
      onConfirm: async () => {
        try {
          await deleteGroupApi(orgId || 0, group.id);
          await refreshGroups();

          openModal({
            type: "success",
            title: "삭제 완료",
            message: `"${group.name}" 그룹이 삭제되었습니다.`,
            autoClose: true,
            autoCloseDelay: 1800,
          });
        } catch (err: any) {
          openModal({
            type: "error",
            title: "삭제 실패",
            message: err.message || "그룹 삭제 중 오류가 발생했습니다.",
          });
        }
      },
    });
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
    </>
  );
};

export default GroupCategoryModal;

/* ---------------------------------------------------------
   ⭐ CategoryManager
--------------------------------------------------------- */
const CategoryManager = ({ group }: { group: GroupCategory }) => {
  const { orgId } = useAuth();
  const { openModal } = useModal();

  const [categories, setCategories] = useState(group.categories);
  const [newCat, setNewCat] = useState("");

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

  const add = async () => {
    if (!newCat.trim()) return;
    await addCategory(orgId || 0, group.id, newCat.trim());
    setNewCat("");
    load();
  };

  const remove = (catId: number) => {
    openModal({
      type: "delete",
      title: "카테고리 삭제",
      message: `이 카테고리를 삭제하시겠습니까?`,
      requiredKeyword: "삭제",
      confirmText: "삭제",
      onConfirm: async () => {
        try {
          await deleteCategory(orgId || 0, group.id, catId);
          await load();

          openModal({
            type: "success",
            title: "삭제 완료",
            message: "카테고리가 삭제되었습니다.",
            autoClose: true,
          });
        } catch (err: any) {
          openModal({
            type: "error",
            title: "삭제 실패",
            message: err.message || "카테고리 삭제 실패",
          });
        }
      },
    });
  };

  const startEdit = (cat: { id: number; title: string }) => {
    setEditingCatId(cat.id);
    setEditingTitle(cat.title);
  };

  const confirmEdit = (catId: number) => {
    openModal({
      type: "edit",
      title: "카테고리 수정",
      message: `이 카테고리를 "${editingTitle}"로 수정하시겠습니까?`,
      requiredKeyword: "수정",
      confirmText: "수정",
      onConfirm: async () => {
        try {
          await updateCategory(orgId || 0, group.id, catId, editingTitle.trim());
          setEditingCatId(null);
          await load();

          openModal({
            type: "success",
            title: "수정 완료",
            message: "카테고리가 수정되었습니다.",
            autoClose: true,
          });
        } catch (err: any) {
          openModal({
            type: "error",
            title: "수정 실패",
            message: err.message || "카테고리 수정 실패",
          });
        }
      },
    });
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
                  <span className="font-medium text-gray-700">{cat.title}</span>
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