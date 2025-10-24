import React, { useState } from "react";
import { X, Plus, Trash2, Info, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmActionModal from "@/components/Common/Modals/ConfirmActionModal";

interface HashtagModalProps {
  hashtags: string[];
  plan?: "무료" | "인기" | "플러스" | "비즈니스" | "엔터프라이즈";
  onClose: () => void;
  onSubmit: (updated: string[]) => void;
}

const HashtagModal: React.FC<HashtagModalProps> = ({
  hashtags,
  plan = "무료",
  onClose,
  onSubmit,
}) => {
  const [newTag, setNewTag] = useState("");
  const [tagList, setTagList] = useState(hashtags);
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  // 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);

  // 요금제별 해시태그 제한 수
  const planLimit: Record<string, number> = {
    무료: 6,
    인기: 10,
    플러스: 20,
    비즈니스: 30,
    엔터프라이즈: 999,
  };

  const maxTags = planLimit[plan];

  // 추가 함수
  const addTag = () => {
    if (!newTag.trim()) {
      setErrorMessage("해시태그를 입력해주세요.");
      setShowErrorModal(true);
      return;
    }
    
    if (tagList.includes(newTag.trim())) {
      setErrorMessage("이미 존재하는 해시태그입니다.");
      setShowErrorModal(true);
      return;
    }

    if (tagList.length >= maxTags) {
      setShowUpgradeConfirm(true);
      return;
    }

    setTagList((prev) => [...prev, newTag.trim()]);
    setNewTag("");
  };

  const handleUpgradeConfirm = () => {
    setShowUpgradeConfirm(false);
    navigate("/plans");
  };

  const removeTag = (tag: string) => {
    setTagList((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
          {/* 헤더 */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Hash size={20} className="text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                해시태그 관리
              </h2>
              {/* 요금제 정보 툴팁 */}
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                {showTooltip && (
                  <div className="absolute left-8 top-0 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-56 z-10">
                    <p className="font-semibold mb-2">요금제별 해시태그 한도</p>
                    <ul className="text-gray-200 space-y-1.5">
                      <li className="flex justify-between">
                        <span>무료</span>
                        <span className="font-medium">최대 6개</span>
                      </li>
                      <li className="flex justify-between">
                        <span>인기</span>
                        <span className="font-medium">최대 10개</span>
                      </li>
                      <li className="flex justify-between">
                        <span>플러스</span>
                        <span className="font-medium">최대 20개</span>
                      </li>
                      <li className="flex justify-between">
                        <span>비즈니스</span>
                        <span className="font-medium">최대 30개</span>
                      </li>
                      <li className="flex justify-between">
                        <span>엔터프라이즈</span>
                        <span className="font-medium">무제한</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
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
                    현재 요금제: <span className="text-green-600">{plan}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    사용 중: {tagList.length} / {maxTags}개
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {tagList.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    / {maxTags === 999 ? "∞" : maxTags}
                  </div>
                </div>
              </div>
              {/* 프로그레스 바 */}
              <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    tagList.length >= maxTags
                      ? "bg-red-500"
                      : tagList.length >= maxTags * 0.8
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min((tagList.length / maxTags) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                새 해시태그 추가
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="해시태그 입력 (# 없이)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={addTag}
                  disabled={tagList.length >= maxTags}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    tagList.length >= maxTags
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <Plus size={16} /> 추가
                </button>
              </div>
              {tagList.length >= maxTags && (
                <p className="text-xs text-red-500 mt-2">
                  해시태그 한도에 도달했습니다. 요금제를 업그레이드하세요.
                </p>
              )}
            </div>

            {/* 해시태그 목록 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                등록된 해시태그 ({tagList.length})
              </label>
              {tagList.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tagList.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        <Hash size={14} className="text-green-600" />
                        {tag}
                      </span>
                      <button
                        onClick={() => removeTag(tag)}
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
                  등록된 해시태그가 없습니다.
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
                onSubmit(tagList);
                onClose();
              }}
              className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="입력 오류"
          message={errorMessage}
          confirmText="확인"
          color="red"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {/* 요금제 업그레이드 확인 모달 */}
      {showUpgradeConfirm && (
        <ConfirmActionModal
          title="해시태그 한도 초과"
          message={`현재 [${plan}] 요금제에서는 최대 ${maxTags}개의 해시태그만 생성할 수 있습니다.\n요금제를 업그레이드하시겠습니까?`}
          keyword="업그레이드"
          confirmText="요금제 보기"
          color="green"
          onConfirm={handleUpgradeConfirm}
          onClose={() => setShowUpgradeConfirm(false)}
        />
      )}
    </>
  );
};

export default HashtagModal;