import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image,
  Calendar,
  FileVideo,
  Users,
  Brain,
  FileText,
  MessageCircle,
} from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { fetchOrgMyActivityGroup } from "@/api/myactivity/info";
import { requestVideoUpload, uploadVideoToS3 } from "@/api/video/video";

interface UploadVideoModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Category {
  id: number;
  title: string;
}

interface Group {
  id: number;
  name: string;
  categories: Category[];
}

interface VideoInfo {
  name: string;
  size: string;
  type: string;
  durationSec: number;
  durationText: string;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { orgId } = useAuth();
  const { openModal, closeModal } = useModal();

  // 그룹 + 카테고리 API 데이터
  const [groups, setGroups] = useState<Group[]>([]);

  // 업로드 데이터
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null as File | null,
    thumbnailPreview: "",
    categories: [] as number[], // 선택된 카테고리 ID
    visibility: "organization", // organization | private | group
    selectedGroups: [] as number[], // 선택한 그룹 ID
    allowComments: true,
    aiType: "NONE" as "NONE" | "QUIZ" | "SUMMARY" | "FEEDBACK",
    expiration: "none", // 7 | 30 | none
    customDate: "",
    videoFile: null as File | null,
    videoInfo: null as VideoInfo | null,
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // 영상 업로드
  const handleSubmit = async () => {
    if (!formData.title.trim()) return showError("제목을 입력해주세요.");
    if (!formData.description.trim()) return showError("설명을 입력해주세요.");
    if (!formData.videoFile) return showError("동영상 파일을 업로드해주세요.");
    if (!formData.thumbnail) return showError("썸네일 PNG 이미지를 업로드해주세요.");

    if (formData.videoFile.type !== "video/mp4")
      return showError("동영상은 MP4 형식만 업로드할 수 있습니다.");
    if (formData.thumbnail.type !== "image/png")
      return showError("썸네일은 PNG 파일만 가능합니다.");

    if (!orgId) return showError("조직 정보가 없습니다.");

    try {

      // Step 1: 서버에 메타데이터 전달 → presigned URL 받기
      const { presigned_url } = await requestVideoUpload(orgId!, {
        title: formData.title,
        description: formData.description,
        whole_time: formData.videoInfo!.durationSec,
        is_comment: formData.allowComments,
        ai_function: formData.aiType,
        expired_at:
          formData.expiration === "none" ? null : formData.customDate,
        thumbnail_img: formData.thumbnail
      });

      // Step 2: presigned URL로 영상 업로드(PUT)
      await uploadVideoToS3(presigned_url, formData.videoFile);

      openModal({
        type: "success",
        title: "업로드 완료!",
        message: "영상이 정상적으로 업로드되었습니다.",
        autoClose: true,
        autoCloseDelay: 2000,
      });
      onSubmit(formData);
    } catch (err: any) {
      openModal({
        type: "error",
        title: "오류 발생",
        message: err.message || "업로드 중 오류가 발생했습니다."
      });
    }
  };

  // 🔹 그룹 가져오기
  useEffect(() => {
    const load = async () => {
      try {
        if (!orgId) return;
        const result = await fetchOrgMyActivityGroup(orgId);
        // result.member_groups: { id, name, categories[] }
        setGroups(result.member_groups || []);
      } catch (err: any) {
        console.error("❌ 그룹 조회 실패:", err);
      }
    };
    load();
  }, [orgId]);

  // Input 변경 헬퍼
  const handleChange = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // duration 포맷 (초 → mm:ss)
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // 비디오 선택 시: 파일 + 메타데이터(duration) 읽기
  const handleVideoFileChange = (file: File) => {
    if (!file) return;

    // mp4 체크는 나중에 검증에서도 한 번 더 함
    const sizeStr = formatFileSize(file.size);

    const videoEl = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    videoEl.src = objectUrl;

    videoEl.onloadedmetadata = () => {
      const durationSec = Math.floor(videoEl.duration || 0);
      const durationText = formatDuration(durationSec);

      handleChange("videoFile", file);
      handleChange("videoInfo", {
        name: file.name,
        size: sizeStr,
        type: file.type,
        durationSec,
        durationText,
      });

      URL.revokeObjectURL(objectUrl);
    };
  };

  // 만료 기간 선택
  const handleExpirationSelect = (value: string) => {
    handleChange("expiration", value);

    if (value === "7" || value === "30") {
      const date = new Date();
      date.setDate(date.getDate() + Number(value));
      handleChange("customDate", date.toISOString().split("T")[0]);
    } else {
      handleChange("customDate", "");
    }
  };

  // 공개 범위 변경
  const handleVisibilityChange = (value: string) => {
    handleChange("visibility", value);
    if (value !== "group") {
      // 그룹 공개가 아니면 선택된 그룹/카테고리 초기화
      setAvailableCategories([]);
      setFormData((prev) => ({
        ...prev,
        selectedGroups: [],
        categories: [],
      }));
    }
  };

  // 그룹 선택
  const handleGroupToggle = (groupId: number) => {
    setFormData((prev) => {
      const exists = prev.selectedGroups.includes(groupId);
      const nextGroups = exists
        ? prev.selectedGroups.filter((id) => id !== groupId)
        : [...prev.selectedGroups, groupId];

      // 선택된 그룹 기반 카테고리 재계산
      const relatedCategories = groups
        .filter((g) => nextGroups.includes(g.id))
        .flatMap((g) => g.categories || []);

      // 카테고리 중복 제거
      const categoryMap = new Map<number, Category>();
      relatedCategories.forEach((c) => {
        if (!categoryMap.has(c.id)) categoryMap.set(c.id, c);
      });
      setAvailableCategories(Array.from(categoryMap.values()));

      // 선택 해제된 그룹에 속한 카테고리가 있으면 그대로 둘지 삭제할지는 정책에 따라 다름
      // 여기서는 남겨둔다. 필요하면 여기서 정리해도 됨.

      return {
        ...prev,
        selectedGroups: nextGroups,
      };
    });
  };

  // 선택된 그룹 태그에서 X 눌러 해제
  const removeSelectedGroup = (groupId: number) => {
    handleGroupToggle(groupId);
  };

  // 카테고리 선택 토글
  const toggleCategory = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  // 선택된 카테고리 태그 X로 해제
  const removeCategory = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== id),
    }));
  };

  // 에러 핸들링
  const showError = (msg: string) => {
    openModal({
      type: "error",
      title: "오류 발생",
      message: msg || "처리 중 오류가 발생했습니다.",
    });
  };


  // AI 버튼 선택 렌더 헬퍼
  const aiOptions: { key: "NONE" | "QUIZ" | "SUMMARY" | "FEEDBACK"; label: string; icon: React.ReactNode }[] =
    [
      { key: "NONE", label: "사용 안 함", icon: <X size={16} /> },
      { key: "QUIZ", label: "퀴즈", icon: <Brain size={16} /> },
      { key: "SUMMARY", label: "요약", icon: <FileText size={16} /> },
      { key: "FEEDBACK", label: "피드백", icon: <MessageCircle size={16} /> },
    ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              새 동영상 업로드
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
              {/* -------------------------------------
                  LEFT (30%) : VIDEO + THUMB
              -------------------------------------- */}
              <div className="md:col-span-3 space-y-5">
                {/* VIDEO FILE */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    동영상 파일 (MP4) *
                  </label>
                  <label className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col justify-center items-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition">
                    <Upload size={16} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">
                      {formData.videoFile?.name ?? "MP4 파일을 선택하거나 드래그하세요"}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        handleVideoFileChange(file);
                      }}
                    />
                  </label>

                  {/* 비디오 기본 정보 */}
                  {formData.videoInfo && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <FileVideo size={16} className="text-blue-600" />
                        <span className="font-semibold">
                          {formData.videoInfo.name}
                        </span>
                      </div>
                      <p className="pl-6">
                        형식: <span className="font-medium">{formData.videoInfo.type}</span>
                      </p>
                      <p className="pl-6">
                        파일 크기:{" "}
                        <span className="font-medium">
                          {formData.videoInfo.size}
                        </span>
                      </p>
                      <p className="pl-6">
                        영상 길이:{" "}
                        <span className="font-medium">
                          {formData.videoInfo.durationText}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* THUMBNAIL */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    썸네일 이미지 (PNG) *
                  </label>
                  <label className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition overflow-hidden">
                    {formData.thumbnailPreview ? (
                      <img
                        src={formData.thumbnailPreview}
                        alt="썸네일 미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Image size={28} className="mb-1" />
                        <span className="text-xs">
                          PNG 이미지 선택 (권장 1280×720)
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        handleChange("thumbnail", file);
                        handleChange(
                          "thumbnailPreview",
                          URL.createObjectURL(file)
                        );
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* -------------------------------------
                  RIGHT (70%) : META DATA
              -------------------------------------- */}
              <div className="md:col-span-7 space-y-6">
                {/* TITLE */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    제목 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="영상 제목을 입력하세요"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    설명 *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
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
                      { label: "비공개", value: "private" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          handleVisibilityChange(opt.value as string)
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${formData.visibility === opt.value
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GROUP SELECTION (visibility === group 일 때만) */}
                {formData.visibility === "group" && (
                  <div className="space-y-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        그룹 선택 *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {groups.map((g) => {
                          const active =
                            formData.selectedGroups.includes(g.id);
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => handleGroupToggle(g.id)}
                              className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1 transition ${active
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
                    </div>

                    {/* 선택된 그룹 태그 */}
                    {formData.selectedGroups.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {formData.selectedGroups.map((gid) => {
                          const group = groups.find((g) => g.id === gid);
                          if (!group) return null;
                          return (
                            <span
                              key={gid}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
                            >
                              {group.name}
                              <button
                                type="button"
                                onClick={() => removeSelectedGroup(gid)}
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

                {/* CATEGORY SELECTION (그룹이 선택된 경우에만) */}
                {formData.visibility === "group" &&
                  availableCategories.length > 0 && (
                    <div className="space-y-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          카테고리 선택
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableCategories.map((c) => {
                            const active = formData.categories.includes(c.id);
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => toggleCategory(c.id)}
                                className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1 transition ${active
                                  ? "bg-indigo-500 text-white border-indigo-500"
                                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                  }`}
                              >
                                {c.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 선택된 카테고리 태그 */}
                      {formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {formData.categories.map((cid) => {
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
                  <span className="text-sm font-medium text-gray-700">댓글 기능</span>

                  <button
                    type="button"
                    onClick={() => handleChange("allowComments", !formData.allowComments)}
                    className={`w-11 h-6 rounded-full transition-all relative 
      ${formData.allowComments ? "bg-blue-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow 
        transition-transform ${formData.allowComments ? "translate-x-5" : ""}`}
                    />
                  </button>
                </div>
                {/* AI TYPE */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    AI 기능
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {aiOptions.map((opt) => {
                      const active = formData.aiType === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleChange("aiType", opt.key)}
                          className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-2 transition ${active
                            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {opt.icon}
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 space-y-1">
                    <p>
                      ⚠️ AI 생성을 위해 영상 일부 데이터가 AI 학습용으로
                      일시적으로 사용될 수 있습니다.
                    </p>
                    <p>
                      💡 동영상 업로드 후 <b>AI 사용 여부를 수정할 수 없습니다.</b>
                    </p>
                  </div>
                </div>

                {/* EXPIRATION */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    영상 만료 기간
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      { label: "7일 뒤", value: "7" },
                      { label: "30일 뒤", value: "30" },
                      { label: "만료 없음", value: "none" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleExpirationSelect(opt.value)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition ${formData.expiration === opt.value
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {/* Date Picker (만료 없음이면 숨김) */}
                  {formData.expiration !== "none" && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={16} className="text-gray-400" />
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm 
                                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={formData.customDate}
                        onChange={(e) => handleChange("customDate", e.target.value)}
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
              onClick={handleSubmit}
              className="px-5 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              업로드
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadVideoModal;