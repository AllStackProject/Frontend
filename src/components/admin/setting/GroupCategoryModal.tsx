import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Users, Settings, Check, Edit2, AlertCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { addCategory, deleteCategory, updateCategory } from "@/api/adminOrg/category";

import { addGroup, deleteGroupApi } from "@/api/adminOrg/group";
import { fetchOrgInfo } from "@/api/adminOrg/info";
import { useAuth } from "@/context/AuthContext";
import ButtonSpinner from "@/components/common/ButtonSpinner";

/* ---------------------------------------------------------
   타입 정의
--------------------------------------------------------- */
interface Category {
  id: number;
  title: string;
}

interface GroupCategory {
  id: number;
  name: string;
  categories: Category[];
}

interface GroupCategoryModalProps {
  groups: GroupCategory[];
  onClose: () => void;
  onSubmit?: (updated: GroupCategory[]) => void;
}

/* ---------------------------------------------------------
   메인 모달 컴포넌트
--------------------------------------------------------- */
const GroupCategoryModal: React.FC<GroupCategoryModalProps> = ({
  groups,
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const { openModal } = useModal();
  
  const [initialGroups] = useState<GroupCategory[]>(JSON.parse(JSON.stringify(groups))); 
  const [groupList, setGroupList] = useState<GroupCategory[]>(JSON.parse(JSON.stringify(groups)));
  const [newGroupName, setNewGroupName] = useState("");
  
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------------------------------------------------
     변경사항 감지
  --------------------------------------------------------- */
  useEffect(() => {
    const changed = JSON.stringify(initialGroups) !== JSON.stringify(groupList);
    setHasChanges(changed);
  }, [groupList, initialGroups]);

  /* ---------------------------------------------------------
     그룹 추가 (로컬)
  --------------------------------------------------------- */
  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup: GroupCategory = {
      id: Date.now(), // 임시 ID (서버에서 실제 ID 받음)
      name: newGroupName.trim(),
      categories: [],
    };

    setGroupList([...groupList, newGroup]);
    setNewGroupName("");
  };

  /* ---------------------------------------------------------
     그룹 삭제 (로컬)
  --------------------------------------------------------- */
  const handleDeleteGroup = (groupId: number) => {
    const group = groupList.find(g => g.id === groupId);
    if (!group) return;

    openModal({
      type: "delete",
      title: "그룹 삭제",
      message: `"${group.name}" 그룹을 삭제하시겠습니까?`,
      confirmText: "삭제",
      onConfirm: () => {
        setGroupList(groupList.filter(g => g.id !== groupId));
      },
    });
  };

  /* ---------------------------------------------------------
     카테고리 추가 (로컬)
  --------------------------------------------------------- */
  const handleAddCategory = (groupId: number, categoryTitle: string) => {
    if (!categoryTitle.trim()) return;

    setGroupList(groupList.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          categories: [
            ...g.categories,
            { id: Date.now(), title: categoryTitle.trim() }
          ]
        };
      }
      return g;
    }));
  };

  /* ---------------------------------------------------------
     카테고리 수정 (로컬)
  --------------------------------------------------------- */
  const handleUpdateCategory = (groupId: number, categoryId: number, newTitle: string) => {
    setGroupList(groupList.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          categories: g.categories.map(c =>
            c.id === categoryId ? { ...c, title: newTitle } : c
          )
        };
      }
      return g;
    }));
  };

  /* ---------------------------------------------------------
     카테고리 삭제 (로컬)
  --------------------------------------------------------- */
  const handleDeleteCategory = (groupId: number, categoryId: number) => {
    setGroupList(groupList.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          categories: g.categories.filter(c => c.id !== categoryId)
        };
      }
      return g;
    }));
  };

  /* ---------------------------------------------------------
     취소 버튼 클릭 - 변경사항 버림
  --------------------------------------------------------- */
  const handleCancel = () => {
    if (hasChanges) {
      openModal({
        type: "confirm",
        title: "변경사항이 있습니다",
        message: "저장하지 않은 변경사항이 있습니다.\n정말 취소하시겠습니까?",
        confirmText: "취소하기",
        cancelText: "계속 편집",
        onConfirm: () => {
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  /* ---------------------------------------------------------
     저장 버튼 클릭 - 실제 API 호출
  --------------------------------------------------------- */
  const handleSave = async () => {
    if (isSaving) return; // 중복 클릭 방지
    
    setIsSaving(true);
    
    try {

      // 1. 삭제된 그룹 처리
      const deletedGroups = initialGroups.filter(
        ig => !groupList.find(g => g.id === ig.id)
      );

      for (const group of deletedGroups) {
        await deleteGroupApi(orgId || 0, group.id);
      }

      // 2. 추가된 그룹 처리
      const addedGroups = groupList.filter(
        g => !initialGroups.find(ig => ig.id === g.id)
      );

      for (const group of addedGroups) {
        await addGroup(orgId || 0, group.name);
      }

      // 3. 최신 그룹 목록 불러오기
      const info = await fetchOrgInfo(orgId || 0);
      const serverGroups: GroupCategory[] = (info.member_groups || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        categories: g.categories ?? [],
      }));

      // 4. 각 그룹의 카테고리 처리
      for (const localGroup of groupList) {
        // 서버에서 해당 그룹 찾기
        const serverGroup = serverGroups.find(sg => sg.name === localGroup.name);
        if (!serverGroup) continue;

        const initialGroup = initialGroups.find(ig => ig.id === localGroup.id);
        const initialCategories = initialGroup?.categories || [];

        // 삭제된 카테고리
        const deletedCategories = initialCategories.filter(
          ic => !localGroup.categories.find(c => c.id === ic.id)
        );

        for (const cat of deletedCategories) {
          await deleteCategory(orgId || 0, serverGroup.id, cat.id);
        }

        // 추가된 카테고리
        const addedCategories = localGroup.categories.filter(
          c => !initialCategories.find(ic => ic.id === c.id)
        );

        for (const cat of addedCategories) {
          await addCategory(orgId || 0, serverGroup.id, cat.title);
        }

        // 수정된 카테고리
        const updatedCategories = localGroup.categories.filter(c => {
          const initial = initialCategories.find(ic => ic.id === c.id);
          return initial && initial.title !== c.title;
        });

        for (const cat of updatedCategories) {
          await updateCategory(orgId || 0, serverGroup.id, cat.id, cat.title);
        }
      }

      // 5. 최종 업데이트된 목록 불러오기
      const finalInfo = await fetchOrgInfo(orgId || 0);
      const finalGroups: GroupCategory[] = (finalInfo.member_groups || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        categories: g.categories ?? [],
      }));

      openModal({
        type: "success",
        title: "저장 완료",
        message: "그룹 및 카테고리가 성공적으로 저장되었습니다.",
      });

      // 저장 성공 시에만 onSubmit 호출
      if (onSubmit) {
        onSubmit(finalGroups);
      }
      
      onClose();
    } catch (err: any) {
      console.error("❌ 저장 실패:", err);
      openModal({
        type: "error",
        title: "저장 실패",
        message: err.message || "저장 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-5 border-b bg-blue-50">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Settings size={20} className="text-white" />
              </div>
              <span className="text-blue-900">
                그룹 및 카테고리 관리
              </span>
            </h2>
            
            {hasChanges && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <AlertCircle size={14} className="text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">저장되지 않음</span>
              </div>
            )}
          </div>

          {/* 그룹 추가 */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="새 그룹명을 입력하세요"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleAddGroup}
                disabled={!newGroupName.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} strokeWidth={2.5} /> 그룹 추가
              </button>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6 overflow-y-auto flex-1">
            {groupList.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Users size={40} className="text-gray-300" />
                </div>
                <p className="text-base font-medium text-gray-600 mb-2">생성된 그룹이 없습니다</p>
                <p className="text-sm text-gray-400">새 그룹을 추가해보세요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {groupList.map((group) => (
                  <div 
                    key={group.id} 
                    className="border-2 border-gray-200 rounded-xl p-5 bg-white hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        {group.name}
                      </h3>

                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="그룹 삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <CategoryManager
                      group={group}
                      onAddCategory={(title) => handleAddCategory(group.id, title)}
                      onUpdateCategory={(catId, title) => handleUpdateCategory(group.id, catId, title)}
                      onDeleteCategory={(catId) => handleDeleteCategory(group.id, catId)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="p-5 border-t bg-gray-50 flex justify-between items-center gap-3">
            <div className="text-sm text-gray-500">
              {hasChanges ? (
                <span className="text-amber-600 font-medium">⚠️ 변경사항을 저장해주세요</span>
              ) : (
                <span>변경사항 없음</span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-white hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <ButtonSpinner />
                    저장 중...
                  </>
                ) : (
                  "저장"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCategoryModal;

/* ---------------------------------------------------------
   ⭐ CategoryManager (동일)
--------------------------------------------------------- */
interface CategoryManagerProps {
  group: GroupCategory;
  onAddCategory: (title: string) => void;
  onUpdateCategory: (categoryId: number, newTitle: string) => void;
  onDeleteCategory: (categoryId: number) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  group,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const { openModal } = useModal();
  
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleAdd = () => {
    if (!newCategoryTitle.trim()) return;
    onAddCategory(newCategoryTitle.trim());
    setNewCategoryTitle("");
  };

  const handleDelete = (cat: Category) => {
    openModal({
      type: "delete",
      title: "카테고리 삭제",
      message: `"${cat.title}" 카테고리를 삭제하시겠습니까?`,
      confirmText: "삭제",
      onConfirm: () => {
        onDeleteCategory(cat.id);
      },
    });
  };

  const startEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingTitle(cat.title);
  };

  const confirmEdit = (catId: number) => {
    if (!editingTitle.trim()) return;
    
    openModal({
      type: "edit",
      title: "카테고리 수정",
      message: `카테고리를 "${editingTitle}"로 수정하시겠습니까?`,
      confirmText: "수정",
      onConfirm: () => {
        onUpdateCategory(catId, editingTitle.trim());
        setEditingCatId(null);
      },
    });
  };

  const cancelEdit = () => {
    setEditingCatId(null);
    setEditingTitle("");
  };

  return (
    <div className="space-y-4">
      {/* 카테고리 추가 입력 */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="카테고리 이름 입력"
          value={newCategoryTitle}
          onChange={(e) => setNewCategoryTitle(e.target.value)}
          className="flex-1 border-2 border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!newCategoryTitle.trim()}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all flex items-center gap-1.5 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} strokeWidth={2.5} /> 추가
        </button>
      </div>

      {/* 카테고리 리스트 */}
      <div className="flex flex-wrap gap-2">
        {group.categories.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">등록된 카테고리가 없습니다</p>
        ) : (
          group.categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-3 py-2 rounded-lg text-sm group hover:shadow-md transition-all"
            >
              {editingCatId === cat.id ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="border-2 border-green-300 px-2 py-1 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                    onClick={() => confirmEdit(cat.id)}
                    title="저장"
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    onClick={cancelEdit}
                    title="취소"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-800">{cat.title}</span>
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => startEdit(cat)}
                    title="수정"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(cat)}
                    title="삭제"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};