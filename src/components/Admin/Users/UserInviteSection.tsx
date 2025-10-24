import React, { useState } from "react";
import { CheckCircle2, XCircle, UserCheck, Clock } from "lucide-react";
import ConfirmActionModal from "@/components/Admin/Users/Confirmactionmodal";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
}

const dummyPending: PendingUser[] = [
  { id: "201", name: "정우성", email: "ws.jung@fisa.com", requestedAt: "2025-10-21" },
  { id: "202", name: "한지민", email: "jm.han@fisa.com", requestedAt: "2025-10-22" },
  { id: "203", name: "송중기", email: "jk.song@fisa.com", requestedAt: "2025-10-23" },
  { id: "204", name: "배수지", email: "sj.bae@fisa.com", requestedAt: "2025-10-23" },
];

const UserInviteSection: React.FC = () => {
  const [pending, setPending] = useState(dummyPending);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = (user: PendingUser) => {
    setSelectedUser(user);
    setModalAction("approve");
  };

  const handleReject = (user: PendingUser) => {
    setSelectedUser(user);
    setModalAction("reject");
  };

  const confirmAction = () => {
    if (selectedUser) {
      setPending((prev) => prev.filter((p) => p.id !== selectedUser.id));
      // TODO: 실제 승인/거절 API 호출
      setSelectedUser(null);
      setModalAction(null);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalAction(null);
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
            <UserCheck size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">승인 대기 사용자</h2>
            <p className="text-sm text-gray-600">
              대기 중: <span className="font-semibold text-amber-600">{pending.length}명</span>
            </p>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        {pending.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 font-semibold">사용자 ID</th>
                <th className="px-4 py-3 font-semibold">이름</th>
                <th className="px-4 py-3 font-semibold">이메일</th>
                <th className="px-4 py-3 font-semibold">요청일</th>
                <th className="px-4 py-3 font-semibold text-center">처리</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} className="text-gray-400" />
                      {user.requestedAt}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleApprove(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg text-xs font-medium transition-colors"
                        title="승인"
                      >
                        <CheckCircle2 size={14} /> 승인
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                        title="거절"
                      >
                        <XCircle size={14} /> 거절
                      </button>
                    </div>
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
            <p className="text-gray-500 font-medium mb-1">
              승인 대기 중인 사용자가 없습니다.
            </p>
            <p className="text-sm text-gray-400">
              새로운 가입 요청이 있으면 여기에 표시됩니다.
            </p>
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      {pending.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-200">
                <span className="text-blue-700 text-xs font-bold">i</span>
              </div>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">가입 승인 안내</p>
              <p className="text-blue-700">
                승인 시 해당 사용자는 조직의 <span className="font-semibold">'일반 사용자'</span> 권한으로 가입됩니다.
                권한 변경은 사용자 목록에서 가능합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {selectedUser && modalAction && (
        <ConfirmActionModal
          user={selectedUser}
          action={modalAction}
          onClose={closeModal}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
};

export default UserInviteSection;