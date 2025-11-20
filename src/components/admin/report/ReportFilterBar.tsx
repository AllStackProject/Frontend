import React from "react";
import { Calendar } from "lucide-react";

interface ReportFilterBarProps {
  selectedMonth: string; // yyyy-MM
  onChangeMonth: (month: string) => void;
}

const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  selectedMonth,
  onChangeMonth,
}) => {
  const getRecentThreeMonths = (): string[] => {
    const today = new Date();
    const months = [];

    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months.push(m);
    }

    return months;
  };

  const months = getRecentThreeMonths();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">조회 기간:</span>
        </div>

        <div className="flex gap-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => onChangeMonth(month)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                ${
                  selectedMonth === month
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportFilterBar;