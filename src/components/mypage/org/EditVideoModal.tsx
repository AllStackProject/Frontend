import React, { useState } from "react";
import {
  X,
  Calendar,
  FileVideo,
  Image,
  Users,
  Lock,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { updateVideo } from "@/api/myactivity/video";
import { useAuth } from "@/context/AuthContext";
import type { VideoMetaData } from "@/types/video";

/* ============================
    타입 정의
============================ */

interface Category {
  id: number;
  title: string;
  is_selected: boolean;
}

interface Group {
  id: number;
  name: string;
  is_selected: boolean;
  categories: Category[];
}

interface EditVideoModalProps {
  video: VideoMetaData & { id: number }; // id 명시적으로 추가
  onClose: () => void;
  onSubmit: (data: any) => void;
}

/* ============================
    Modal Component
============================ */
const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  onClose,
  onSubmit,
}) => {
  const { openModal } = useModal();
  const { orgId } = useAuth();

  /* ============================================================
      초기 상태 설정
  ============================================================ */
  const [description, setDescription] = useState(video.description);
  const [allowComments, setAllowComments] = useState(video.is_comment);
  const [visibility, setVisibility] = useState<"organization" | "group" | "private">(
    video.open_scope === "PUBLIC" 
      ? "organization" 
      : video.open_scope === "GROUP"
      ? "group"
      : "private"
  );

  // 선택된 그룹
  const [selectedGroups, setSelectedGroups] = useState<number[]>(
    video.member_groups
      .filter((g) => g.is_selected)
      .map((g) => g.id)
  );

  // 선택된 카테고리
  const [selectedCategories, setSelectedCategories] = useState<number[]>(() => {
    const selected: number[] = [];
    video.member_groups.forEach((g) => {
      g.categories.forEach((c) => {
        if (c.is_selected) selected.push(c.id);
      });
    });
    return selected;
  });

  // 만료일 처리
  const isForever = !video.expired_at || Number(video.expired_at.slice(0, 4)) >= 2100;
  
  const [customDate, setCustomDate] = useState(
    isForever ? "" : video.expired_at?.slice(0, 10) || ""
  );
  
  const [expiration, setExpiration] = useState<"7" | "30" | "none">(
    isForever ? "none" : "none"  // 기본값은 "none", 사용자가 preset 선택하면 변경됨
  );

  console.log("📅 초기 만료일 설정:", {
    expired_at: video.expired_at,
    isForever,
    customDate,
    expiration,
  });

  // 선택 가능한 카테고리 계산
  const availableCategories = video.member_groups
    .filter((g) => selectedGroups.includes(g.id))
    .flatMap((g) => g.categories);

  /* ============================================================
      그룹 선택
  ============================================================ */
  const toggleGroup = (groupId: number) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const removeGroup = (groupId: number) => {
    setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
  };

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const removeCategory = (catId: number) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== catId));
  };

  /* ============================================================
      만료일 preset 선택
  ============================================================ */
  const handleExpirationSelect = (value: "7" | "30" | "none") => {
    setExpiration(value);

    if (value === "7" || value === "30") {
      const date = new Date();
      date.setDate(date.getDate() + Number(value));
      setCustomDate(date.toISOString().split("T")[0]);
    } else {
      // 만료 없음 선택 시 customDate 초기화
      setCustomDate("");
    }
  };

  /* ============================================================
      공개 범위 변경
  ============================================================ */
  const handleVisibilityChange = (value: "organization" | "group" | "private") => {
    setVisibility(value);
    if (value !== "group") {
      setSelectedGroups([]);
      setSelectedCategories([]);
    }
  };

  /* ============================================================
      저장하기 (API 호출)
  ============================================================ */
  const handleSave = async () => {
    if (!orgId) {
      console.error("❌ orgId가 없습니다");
      return openModal({
        type: "error",
        title: "오류",
        message: "조직 정보를 찾을 수 없습니다.",
      });
    }

    // videoId 확인
    const videoId = video.id || (video as any).video_id;
    if (!videoId) {
      console.error("❌ videoId를 찾을 수 없습니다:", video);
      return openModal({
        type: "error",
        title: "오류",
        message: "영상 ID를 찾을 수 없습니다.",
      });
    }

    if (!description.trim()) {
      return openModal({
        type: "error",
        title: "입력 오류",
        message: "영상 설명을 입력해주세요.",
      });
    }

    // 만료일 처리
    // - 만료 없음: 먼 미래 날짜 (2125-12-31)
    // - 7일/30일: 선택된 날짜
    const expired_at: string =
      expiration === "none" 
        ? "2125-12-31"  // 만료 없음 = 먼 미래 날짜
        : (customDate && customDate.trim() !== "" ? customDate : "2125-12-31");

    // API 전송 payload
    const payload = {
      description: description.trim(),
      is_comment: allowComments,
      expired_at,  // 항상 string (null 아님)
      member_groups: visibility === "group" ? selectedGroups : [],
      categories: visibility === "group" ? selectedCategories : [],
    };

    console.log("📤 수정 API 전송 데이터:", {
      videoId,
      orgId,
      payload,
      rawData: {
        description,
        allowComments,
        visibility,
        expiration,
        customDate,
        selectedGroups,
        selectedCategories,
      }
    });

    openModal({
      type: "confirm",
      title: "영상 수정",
      message: "정말로 이 영상 정보를 수정하시겠습니까?",
      confirmText: "수정",
      onConfirm: async () => {
        try {
          console.log("🚀 updateVideo API 호출 시작...");
          console.log(`   - URL: /${orgId}/video/${videoId}`);
          console.log(`   - Payload:`, payload);
          
          const ok = await updateVideo(orgId, videoId, payload);

          console.log("✅ API 응답:", ok);

          if (!ok) {
            throw new Error("수정 실패: API가 false를 반환했습니다");
          }

          openModal({
            type: "success",
            title: "수정 완료",
            message: "영상 정보가 성공적으로 수정되었습니다.",
            autoClose: true,
            autoCloseDelay: 1500,
          });

          // 부모 컴포넌트에 업데이트된 데이터 전달
          onSubmit({ 
            id: videoId, 
            ...payload,
            // 추가 정보도 함께 전달
            visibility,
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

  /* ============================================================
      UI
  ============================================================ */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">동영상 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <Lock size={16} />
            <span>
              제목, 동영상 파일, 썸네일, AI 기능은 수정할 수 없습니다.
            </span>
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
              </div>

              {/* THUMBNAIL - 수정 불가 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                  썸네일 이미지
                  <Lock size={14} className="text-gray-400" />
                </label>
                <div className="w-full aspect-video border-2 border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 cursor-not-allowed overflow-hidden">
                  {video.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={video.thumbnail_url}
                        alt="썸네일"
                        className="w-full h-full object-cover opacity-60"
                      />
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
                  value={video.title}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* DESCRIPTION - 수정 가능 */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  설명 *
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="영상에 대한 설명을 입력하세요"
                />
              </div>

              {/* VISIBILITY */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  공개 범위
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "조직 전체공개", value: "organization" },
                    { label: "특정 그룹만 공개", value: "group" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        handleVisibilityChange(opt.value as any)
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        visibility === opt.value
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
              {visibility === "group" && (
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    그룹 선택 *
                  </label>
                  {video.member_groups.length === 0 ? (
                    <div className="text-xs text-blue-500 rounded-lg">
                      속한 그룹이 없습니다
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {video.member_groups.map((g) => {
                        const active = selectedGroups.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => toggleGroup(g.id)}
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
                  {selectedGroups.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedGroups.map((gid) => {
                        const group = video.member_groups.find(
                          (g) => g.id === gid
                        );
                        if (!group) return null;
                        return (
                          <span
                            key={gid}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {group.name}
                            <button
                              type="button"
                              onClick={() => removeGroup(gid)}
                              className="hover:text-blue-900"
                            >
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
              {visibility === "group" && availableCategories.length > 0 && (
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    카테고리 선택
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((c) => {
                      const active = selectedCategories.includes(c.id);
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
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {selectedCategories.map((cid) => {
                        const cat = availableCategories.find(
                          (c) => c.id === cid
                        );
                        if (!cat) return null;
                        return (
                          <span
                            key={cid}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            {cat.title}
                            <button
                              type="button"
                              onClick={() => removeCategory(cid)}
                              className="hover:text-indigo-900"
                            >
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
                <span className="text-sm font-medium text-gray-700">
                  댓글 기능
                </span>
                <button
                  type="button"
                  onClick={() => setAllowComments(!allowComments)}
                  className={`w-11 h-6 rounded-full transition-all relative ${
                    allowComments ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      allowComments ? "translate-x-5" : ""
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
              </div>

              {/* EXPIRATION */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  영상 만료 기간
                </label>

                {/* 현재 설정된 만료일 표시 */}
                {!isForever && customDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <span className="text-blue-800">
                      현재 만료일: <strong>{new Date(customDate).toLocaleDateString("ko-KR")}</strong>
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: "7일 뒤", value: "7" },
                    { label: "30일 뒤", value: "30" },
                    { label: "만료 없음", value: "none" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        handleExpirationSelect(opt.value as any)
                      }
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                        expiration === opt.value
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Date Picker */}
                {/* 1. expiration이 7일/30일이면 표시 */}
                {/* 2. 기존 날짜가 있으면 표시 (expiration=none이어도) */}
                {(expiration !== "none" || (!isForever && customDate)) && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    <input
                      type="date"
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                    />
                  </div>
                )}
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