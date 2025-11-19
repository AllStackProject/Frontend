import React from "react";
import { X } from "lucide-react";

const plans = [
  { name: "무료", members: "최대 30명", storage: "100GB", price: "무료" },
  { name: "인기", members: "최대 100명", storage: "500GB", price: "월 3만원" },
  { name: "플러스", members: "최대 500명", storage: "3TB", price: "월 7만원" },
  { name: "비즈니스", members: "최대 1000명", storage: "10TB", price: "월 10만원" },
  { name: "비즈니스 플러스", members: "-", storage: "-", price: "영업팀 문의" },
  { name: "엔터프라이즈", members: "-", storage: "-", price: "영업팀 문의" },
];

interface Props {
  onClose: () => void;
}

const PlanChangeModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">요금제 변경</h2>
        <p className="text-gray-600 text-sm mb-6">
          조직의 성장 단계에 맞는 요금제를 선택하세요. (결제 연동은 추후 지원 예정)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-lg p-4 text-center hover:border-blue-400 hover:shadow-md transition cursor-pointer"
            >
              <h3 className="font-bold text-lg text-gray-800">{plan.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{plan.members}</p>
              <p className="text-gray-500 text-sm">{plan.storage}</p>
              <p className="font-semibold text-blue-600 mt-3">{plan.price}</p>
              <button
                disabled={plan.price === "영업팀 문의"}
                className={`mt-4 w-full py-2 rounded-lg text-sm font-medium ${
                  plan.price === "영업팀 문의"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.price === "영업팀 문의" ? "문의하기" : "선택하기"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanChangeModal;