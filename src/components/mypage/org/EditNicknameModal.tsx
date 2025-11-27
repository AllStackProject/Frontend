import { useState } from "react";
import { X, Edit3 } from "lucide-react";
import { checkNicknameAvailability } from "@/api/organization/orgs";
import { useModal } from "@/context/ModalContext";

const EditNicknameModal = ({
  currentNickname,
  onClose,
  onSave,
  orgCode,
}: {
  currentNickname: string;
  onClose: () => void;
  onSave: (nickname: string) => void;
  orgCode: string;
}) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [checking, setChecking] = useState(false);
  const { openModal } = useModal();
  const [checkResult, setCheckResult] = useState<"idle" | "ok" | "dup">("idle");

  const handleCheck = async () => {
    if (!nickname.trim()) {
      openModal({
        type: "error",
        title: "입력 오류",
        message: "닉네임을 입력하세요.",
      });
      return;
    }

    try {
      setChecking(true);
      const available = await checkNicknameAvailability(orgCode, nickname.trim());
      setCheckResult(available ? "ok" : "dup");
    } catch (err: any) {
      openModal({
        type: "error",
        title: "중복 확인 오류",
        message: err.message || "중복 확인 실패",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Edit3 size={18} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold">닉네임 수정</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <label className="text-sm font-medium text-gray-700">새 닉네임</label>

          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setCheckResult("idle");
              }}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
            />

            <button
              onClick={handleCheck}
              disabled={checking}
              className="px-3 py-2 bg-primary text-white rounded-lg"
            >
              {checking ? "..." : "중복 체크"}
            </button>
          </div>

          {checkResult === "ok" && (
            <p className="text-green-600 text-sm">사용 가능한 닉네임입니다.</p>
          )}
          {checkResult === "dup" && (
            <p className="text-red-600 text-sm">사용 중인 닉네임입니다.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 border px-4 py-2 rounded-lg">
            취소
          </button>
          <button
            disabled={checkResult !== "ok"}
            onClick={() => onSave(nickname)}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNicknameModal;