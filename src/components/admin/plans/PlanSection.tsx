import React, { useState } from "react";
import { ArrowRight, Crown } from "lucide-react";
import PlanChangeModal from "@/components/admin/plans/PlanChangeModal";

const currentPlan = {
  name: "플러스",
  members: "최대 500명",
  storage: "최대 3TB",
  price: "월 7만원",
};

const PlanSection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* 현재 요금제 */}
      <div className="border rounded-lg p-6 bg-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Crown className="text-yellow-500" /> 현재 요금제: {currentPlan.name}
          </h3>
          <p className="text-gray-600 mt-2 text-sm">
            멤버수: {currentPlan.members} / 스토리지: {currentPlan.storage}
          </p>
          <p className="text-gray-700 font-semibold mt-1">요금: {currentPlan.price}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
        >
          요금제 변경하기 <ArrowRight size={16} />
        </button>
      </div>

      {/* 요금제 변경 모달 */}
      {showModal && <PlanChangeModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default PlanSection;