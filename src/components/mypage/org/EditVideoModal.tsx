import React, { useEffect, useState } from "react";
import {
  X,
  Image,
  Calendar,
  FileVideo,
  Users,
  Brain,
  FileText,
  MessageCircle,
  Lock,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { fetchOrgMyActivityGroup } from "@/api/myactivity/info";
import { updateVideo } from "@/api/myactivity/video";

interface Category {
  id: number;
  title: string;
}

interface Group {
  id: number;
  name: string;
  categories: Category[];
}

interface EditVideoModalProps {
  video: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface FormState {
  title: string;
  description: string;
  thumbnailPreview: string;
  visibility: "organization" | "group" | "private";
  selectedGroupIds: number[];
  selectedCategoryIds: number[];
  allowComments: boolean;
  aiType: "NONE" | "QUIZ" | "SUMMARY" | "FEEDBACK";
  expiration: "7" | "30" | "none";
  customDate: string;
  videoInfo: {
    name: string;
    size: string;
    type: string;
    durationText: string;
  } | null;
}

const isForeverDate = (dateStr?: string | null) => {
  if (!dateStr) return true;
  const year = Number(dateStr.split("-")[0]);
  return year >= 9999;
};

const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  onClose,
  onSubmit,
}) => {
  const { openModal } = useModal();
  const { orgId } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // 초기값 설정
  const initialTitle = video.title ?? video.name ?? "";
  const initialDescription = video.description ?? "";
  const initialThumbnail = video.thumbnail_url ?? "";
  const initialAllowComments = typeof video.is_comment === "boolean" ? video.is_comment : true;
  const initialAiType = video.ai_function ?? "NONE";
  
  let initialExpiration: "7" | "30" | "none" = "none";
  let initialCustomDate = "";
  
  if (video.expired_at && !isForeverDate(video.expired_at)) {
    initialCustomDate = video.expired_at.slice(0, 10);
  }

  // 공개 범위 결정
  const initialVisibility = (() => {
    if (video.member_groups && video.member_groups.length > 0) return "group";
    if (video.is_private) return "private";
    return "organization";
  })();

  const [form, setForm] = useState<FormState>({
    title: initialTitle,
    description: initialDescription,
    thumbnailPreview: initialThumbnail,
    visibility: initialVisibility,
    selectedGroupIds: (video.member_groups as number[]) ?? [],
    selectedCategoryIds: (video.categories as number[]) ?? [],
    allowComments: initialAllowComments,
    aiType: initialAiType,
    expiration: initialCustomDate ? "none" : "none",
    customDate: initialCustomDate,
    videoInfo: video.whole_time ? {
      name: video.file_name ?? "동영상 파일",
      size: video.file_size ?? "알 수 없음",
      type: "video/mp4",
      durationText: formatDuration(video.whole_time),
    } : null,
  });

  // Duration 포맷
  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // 그룹 로드
  useEffect(() => {
    const loadGroups = async () => {
      try {
        if (!orgId) return;
        const result = await fetchOrgMyActivityGroup(orgId);
        setGroups(result.member_groups || []);
      } catch (err) {
        console.error("❌ 그룹 조회 실패:", err);
      }
    };
    loadGroups();
  }, [orgId]);

  // 선택된 그룹에 따라 카테고리 업데이트
  useEffect(() => {
    const relatedCategories = groups
      .filter((g) => form.selectedGroupIds.includes(g.id))
      .flatMap((g) => g.categories || []);

    const categoryMap = new Map<number, Category>();
    relatedCategories.forEach((c) => {
      if (!categoryMap.has(c.id)) categoryMap.set(c.id, c);
    });
    setAvailableCategories(Array.from(categoryMap.values()));
  }, [form.selectedGroupIds, groups]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 공개 범위 변경
  const handleVisibilityChange = (value: "organization" | "group" | "private") => {
    setField("visibility", value);
    if (value !== "group") {
      setForm((prev) => ({
        ...prev,
        selectedGroupIds: [],
        selectedCategoryIds: [],
      }));
      setAvailableCategories([]);
    }
  };

  // 그룹 선택
  const handleGroupToggle = (groupId: number) => {
    setForm((prev) => {
      const exists = prev.selectedGroupIds.includes(groupId);
      const nextGroups = exists
        ? prev.selectedGroupIds.filter((id) => id !== groupId)
        : [...prev.selectedGroupIds, groupId];

      return {
        ...prev,
        selectedGroupIds: nextGroups,
      };
    });
  };

  // 그룹 제거
  const removeSelectedGroup = (groupId: number) => {
    handleGroupToggle(groupId);
  };

  // 카테고리 선택
  const toggleCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.includes(id)
        ? prev.selectedCategoryIds.filter((c) => c !== id)
        : [...prev.selectedCategoryIds, id],
    }));
  };

  // 카테고리 제거
  const removeCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedCategoryIds: prev.selectedCategoryIds.filter((c) => c !== id),
    }));
  };

  // 만료 기간 선택
  const handleExpirationSelect = (value: "7" | "30" | "none") => {
    setField("expiration", value);

    if (value === "7" || value === "30") {
      const date = new Date();
      date.setDate(date.getDate() + Number(value));
      setField("customDate", date.toISOString().split("T")[0]);
    } else {
      setField("customDate", "");
    }
  };

  // 댓글 허용 토글
  const handleCommentToggle = () => {
    if (form.allowComments) {
      openModal({
        type: "confirm",
        title: "댓글 기능 비활성화",
        message: "댓글 기능을 비활성화하시겠습니까?\n비활성화 시 기존 댓글이 모두 삭제될 수 있습니다.",
        confirmText: "확인",
        onConfirm: () => setField("allowComments", false),
      });
    } else {
      setField("allowComments", true);
    }
  };

  // 저장
  const handleSave = async () => {
    if (!orgId) {
      openModal({
        type: "error",
        title: "오류",
        message: "조직 정보를 찾을 수 없습니다.",
      });
      return;
    }

    if (!form.description.trim()) {
      openModal({
        type: "error",
        title: "입력 오류",
        message: "영상 설명을 입력해주세요.",
      });
      return;
    }

    const expired_at = form.expiration === "none" ? form.customDate || null : form.customDate;

    const payload = {
      description: form.description,
      is_comment: form.allowComments,
      expired_at,
      member_groups: form.visibility === "group" ? form.selectedGroupIds : [],
      categories: form.visibility === "group" ? form.selectedCategoryIds : [],
    };

    openModal({
      type: "confirm",
      title: "수정 확인",
      message: "정말 이 영상 정보를 수정하시겠습니까?",
      confirmText: "수정",
      onConfirm: async () => {
        try {
          // API 호출
          const success = await updateVideo(orgId, video.id, payload);

          if (!success) {
            throw new Error("영상 수정에 실패했습니다.");
          }

          // 성공 모달
          openModal({
            type: "success",
            title: "수정 완료",
            message: "영상 정보가 성공적으로 수정되었습니다.",
            autoClose: true,
            autoCloseDelay: 1500,
          });

          // 부모 컴포넌트에 업데이트 전달
          onSubmit({
            id: video.id,
            ...payload,
          });

          onClose();
        } catch (err: any) {
          console.error("❌ 영상 수정 실패:", err);
          
          openModal({
            type: "error",
            title: "수정 실패",
            message: err.message || "영상 수정 중 오류가 발생했습니다.",
          });
        }
      },
    });
  };

  const aiOptions: { key: "NONE" | "QUIZ" | "SUMMARY" | "FEEDBACK"; label: string; icon: React.ReactNode }[] = [
    { key: "NONE", label: "사용 안 함", icon: <X size={16} /> },
    { key: "QUIZ", label: "퀴즈", icon: <Brain size={16} /> },
    { key: "SUMMARY", label: "요약", icon: <FileText size={16} /> },
    { key: "FEEDBACK", label: "피드백", icon: <MessageCircle size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">동영상 수정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={22} />
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <Lock size={16} />
            <span>제목, 동영상 파일, 썸네일, AI 기능은 수정할 수 없습니다.</span>
          </p>
        </div>

        {/* CONTENT */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* LEFT (30%) : VIDEO + THUMB */}
            <div className="md:col-span-3 space-y-5">
              {/* VIDEO FILE - 수정 불가 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  동영상 파일
                  <Lock size={14} className="text-gray-400" />
                </label>
                <div className="border-2 border-gray-200 rounded-xl h-32 flex flex-col justify-center items-center bg-gray-50 cursor-not-allowed">
                  <FileVideo size={24} className="text-gray-300 mb-2" />
                  <span className="text-xs text-gray-400">수정 불가</span>
                </div>

                {/* 비디오 정보 */}
                {form.videoInfo && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <FileVideo size={16} className="text-gray-500" />
                      <span className="font-semibold">{form.videoInfo.name}</span>
                    </div>
                    <p className="pl-6">형식: <span className="font-medium">{form.videoInfo.type}</span></p>
                    <p className="pl-6">파일 크기: <span className="font-medium">{form.videoInfo.size}</span></p>
                    <p className="pl-6">영상 길이: <span className="font-medium">{form.videoInfo.durationText}</span></p>
                  </div>
                )}
              </div>

              {/* THUMBNAIL - 수정 불가 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  썸네일 이미지
                  <Lock size={14} className="text-gray-400" />
                </label>
                <div className="w-full aspect-video border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 cursor-not-allowed overflow-hidden">
                  {form.thumbnailPreview ? (
                    <div className="relative w-full h-full">
                      <img src={form.thumbnailPreview} alt="썸네일" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Lock size={24} className="text-gray-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <Image size={28} className="mb-1" />
                      <span className="text-xs">썸네일 없음</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT (70%) : META DATA */}
            <div className="md:col-span-7 space-y-6">
              {/* TITLE - 수정 불가 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  제목
                  <Lock size={14} className="text-gray-400" />
                </label>
                <input
                  type="text"
                  value={form.title}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* DESCRIPTION - 수정 가능 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">설명 *</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="영상에 대한 설명을 입력하세요"
                />
              </div>

              {/* VISIBILITY */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">공개 범위</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "조직 전체공개", value: "organization" },
                    { label: "특정 그룹만 공개", value: "group" },
                    { label: "비공개", value: "private" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleVisibilityChange(opt.value as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.visibility === opt.value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GROUP SELECTION */}
              {form.visibility === "group" && (
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">그룹 선택 *</label>
                  {groups.length === 0 ? (
                    <div className="text-xs text-blue-500 rounded-lg">속한 그룹이 없습니다</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {groups.map((g) => {
                        const active = form.selectedGroupIds.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => handleGroupToggle(g.id)}
                            className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1 transition ${
                              active
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                          >
                            <Users size={14} />
                            {g.name}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 선택된 그룹 태그 */}
                  {form.selectedGroupIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {form.selectedGroupIds.map((gid) => {
                        const group = groups.find((g) => g.id === gid);
                        if (!group) return null;
                        return (
                          <span
                            key={gid}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {group.name}
                            <button type="button" onClick={() => removeSelectedGroup(gid)} className="hover:text-blue-900">
                              <X size={12} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* CATEGORY SELECTION */}
              {form.visibility === "group" && availableCategories.length > 0 && (
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">카테고리 선택</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((c) => {
                      const active = form.selectedCategoryIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCategory(c.id)}
                          className={`px-3 py-1.5 rounded-full border text-xs transition ${
                            active
                              ? "bg-indigo-500 text-white border-indigo-500"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {c.title}
                        </button>
                      );
                    })}
                  </div>

                  {/* 선택된 카테고리 태그 */}
                  {form.selectedCategoryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {form.selectedCategoryIds.map((cid) => {
                        const cat = availableCategories.find((c) => c.id === cid);
                        if (!cat) return null;
                        return (
                          <span
                            key={cid}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            {cat.title}
                            <button type="button" onClick={() => removeCategory(cid)} className="hover:text-indigo-900">
                              <X size={12} />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* 댓글 허용 */}
              <div className="flex items-center gap-10 pt-2">
                <span className="text-sm font-medium text-gray-700">댓글 기능</span>
                <button
                  type="button"
                  onClick={handleCommentToggle}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    form.allowComments ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.allowComments ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* AI TYPE - 수정 불가 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                  AI 기능
                  <Lock size={14} className="text-gray-400" />
                </label>
                <div className="flex flex-wrap gap-2">
                  {aiOptions.map((opt) => {
                    const active = form.aiType === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled
                        className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-2 cursor-not-allowed ${
                          active
                            ? "bg-gray-200 text-gray-600 border-gray-300"
                            : "bg-gray-50 text-gray-400 border-gray-200"
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* EXPIRATION */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">영상 만료 기간</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: "7일 뒤", value: "7" },
                    { label: "30일 뒤", value: "30" },
                    { label: "만료 없음", value: "none" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleExpirationSelect(opt.value as any)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                        form.expiration === opt.value
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={form.customDate}
                    onChange={(e) => setField("customDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            수정 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVideoModal;