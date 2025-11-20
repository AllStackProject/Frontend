import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, UserCheck } from "lucide-react";

import ConfirmActionModal from "@/components/admin/user/ConfirmActionModal";
import { useAuth } from "@/context/AuthContext";

// API
import {
  getJoinRequests,
  handleJoinRequest,
} from "@/api/adminSuper/members";

import type { JoinRequestUser, JoinRequestGroup } from "@/types/member";

const UserInviteSection: React.FC = () => {
  const { orgId } = useAuth();

  const [pending, setPending] = useState<JoinRequestUser[]>([]);
  const [groups, setGroups] = useState<JoinRequestGroup[]>([]);

  const [selectedUser, setSelectedUser] = useState<JoinRequestUser | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]); // **그룹 선택 상태**

  // ----------------------
  // 가입 요청 로드
  // ----------------------
  const loadRequests = async () => {
    try {
      if (!orgId) return;

      const { requests, groups } = await getJoinRequests(orgId);
      setPending(requests);
      setGroups(groups);
    } catch (err) {
      console.error("🚨 가입 요청 조회 실패:", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [orgId]);

  // ----------------------
  // 승인/거절 클릭
  // ----------------------
  const handleApprove = (user: JoinRequestUser) => {
    setSelectedUser(user);
    setSelectedGroups([]); // 승인시 초기화
    setModalAction("approve");
  };

  const handleReject = (user: JoinRequestUser) => {
    setSelectedUser(user);
    setModalAction("reject");
  };

  // ----------------------
  // 승인/거절 실제 처리
  // ----------------------
  const confirmAction = async () => {
    if (!selectedUser || !modalAction || !orgId) return;

    try {
      const status = modalAction === "approve" ? "APPROVED" : "REJECTED";

      await handleJoinRequest(orgId, selectedUser.id, {
        status,
        member_group_ids: modalAction === "approve" ? selectedGroups : [],
      });

      // UI 업데이트
      setPending((prev) => prev.filter((p) => p.id !== selectedUser.id));
    } catch (err) {
      console.error("🚨 가입 요청 처리 실패:", err);
    }

    setSelectedUser(null);
    setModalAction(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalAction(null);
  };

  // ----------------------
  // 그룹 선택 토글
  // ----------------------
  const toggleGroup = (id: number) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        {pending.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-2 font-semibold text-center">No</th>
                <th className="px-4 py-2 font-semibold">이름</th>
                <th className="px-4 py-2 font-semibold">닉네임</th>
                <th className="px-4 py-2 font-semibold">요청일</th>
                <th className="px-4 py-2 font-semibold text-center">처리</th>
              </tr>
            </thead>

            <tbody>
              {pending.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {/* No — padding만 적용 */}
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3">{user.user_name}</td>
                  <td className="px-4 py-3">{user.nickname}</td>

                  <td className="px-4 py-3 text-gray-600">
                    {user.requested_at.replace("T", " ").slice(0, 16)}
                  </td>

                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(user)}
                      className="flex items-center gap-1 px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs"
                    >
                      <CheckCircle2 size={14} /> 승인
                    </button>
                    <button
                      onClick={() => handleReject(user)}
                      className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
                    >
                      <XCircle size={14} /> 거절
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                <UserCheck size={32} className="text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500">승인 대기 중인 사용자가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 승인/거절 모달 */}
      {selectedUser && modalAction && (
        <ConfirmActionModal
          user={{
            id: String(selectedUser.id),
            name: selectedUser.user_name,
            email: selectedUser.nickname,
          }}
          action={modalAction}
          groups={groups}              
          selectedGroups={selectedGroups} 
          onToggleGroup={toggleGroup}   
          onClose={closeModal}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
};

export default UserInviteSection;