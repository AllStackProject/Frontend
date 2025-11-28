import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { getUserInfo } from "@/api/user/userInfo";
import { joinOrganization, checkNicknameAvailability } from "@/api/organization/orgs";

interface JoinOrgModalProps {
  onClose: () => void;
  onSuccess: (createdOrg?: { id: number; name: string }) => void;
  refresh: () => Promise<void>;
}

const JoinOrgModal: React.FC<JoinOrgModalProps> = ({ onClose, refresh, onSuccess }) => {
  const { openModal } = useModal();
  const [joinCode, setJoinCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameMessageColor, setNicknameMessageColor] = useState<"red" | "green" | "gray">("gray");

  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
  };

  // 로그인 멤버 이름을 닉네임 초기값으로 설정
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setNickname(data.name || "");
      } catch (err) {
        console.error("🚨 멤버 정보 로드 실패:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    setNicknameMessage("");

    if (joinCode.length !== 6) {
      setNicknameMessageColor("red");
      setNicknameMessage("조직 코드를 먼저 입력해주세요.");
      return;
    }

    if (!nickname.trim()) {
      setNicknameMessageColor("red");
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }

    try {
      const available = await checkNicknameAvailability(joinCode, nickname);

      if (available) {
        setIsNicknameChecked(true);
        setNicknameMessageColor("green");
        setNicknameMessage(`"${nickname}"은(는) 사용 가능한 닉네임입니다.`);
      } else {
        setIsNicknameChecked(false);
        setNicknameMessageColor("red");
        setNicknameMessage(`"${nickname}"은(는) 이미 사용 중입니다.`);
      }
    } catch (err: any) {
      setNicknameMessageColor("red");
      setNicknameMessage(err.message || "닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  // 조직 가입
  const handleJoin = async () => {
    if (!joinCode.trim() || !nickname.trim()) {
      openModal({
        type: "confirm",
        title: "입력 오류",
        message: "조직 코드와 닉네임을 모두 입력해주세요.",
        confirmText: "확인",
      });
      return;
    }

    if (!isNicknameChecked) {
      openModal({
        type: "confirm",
        title: "확인 필요",
        message: "닉네임 중복 확인을 완료해주세요.",
        confirmText: "확인",
      });
      return;
    }

    const codeRegex = /^[A-Za-z0-9]{6}$/;
    if (!codeRegex.test(joinCode)) {
      openModal({
        type: "confirm",
        title: "입력 오류",
        message: "조직 코드는 영어+숫자 6자리여야 합니다.",
        confirmText: "확인",
      });
      return;
    }

    try {
      const res = await joinOrganization(joinCode, nickname);
      if (res.success) {
        openModal({
          type: "success",
          title: "가입 완료",
          message: "조직에 가입되었습니다."
        });
        onClose();
        onSuccess();
        await refresh();
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "조직 가입 중 오류가 발생했습니다.";

      openModal({
        type: "error",
        title: "오류 발생",
        message: errorMsg,
        confirmText: "확인",
      });
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
              조직 가입
            </h2>

            {/* 조직 코드 입력 */}
            <label className="block text-sm font-medium text-text-secondary mb-2">
              조직 코드 *
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) =>
                setJoinCode(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))
              }
              placeholder="예: A12B3C"
              maxLength={6}
              className="w-full border border-border-light rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-primary focus:outline-none"
            />

            {/* 닉네임 입력 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                조직에서 사용할 닉네임 *
              </label>
              <div className="flex gap-2">
                <input
                  name="nickname"
                  value={nickname}
                  onChange={handleNickname}
                  placeholder={isLoadingUser ? "로딩 중..." : "사용할 닉네임을 입력하세요"}
                  disabled={isLoadingUser}
                  className="flex-1 border border-border-light rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-wait"
                />
                <button
                  onClick={handleCheckNickname}
                  disabled={isLoadingUser || joinCode.length !== 6}
                  className={`px-3 py-2 text-sm rounded-lg text-white transition whitespace-nowrap ${joinCode.length === 6
                    ? "bg-primary hover:bg-primary-light"
                    : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  중복 확인
                </button>
              </div>
              {!isLoadingUser && (
                <p className="text-xs text-gray-500 mt-1">
                  초기값은 회원가입 시 이름이며, 자유롭게 수정 가능합니다.
                </p>
              )}
              {/* 하단 메시지 출력 */}
              {nicknameMessage && (
                <p
                  className={`text-xs mt-1 ${nicknameMessageColor === "red"
                    ? "text-red-600"
                    : nicknameMessageColor === "green"
                      ? "text-green-600"
                      : "text-gray-500"
                    }`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border border-border-light hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button
                onClick={handleJoin}
                disabled={joinCode.length !== 6 || !isNicknameChecked}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-light transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                가입 신청
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default JoinOrgModal;