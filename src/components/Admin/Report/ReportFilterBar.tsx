import React, { useState } from "react";
import { Calendar, AlertCircle } from "lucide-react";

interface ReportFilterBarProps {
  period: string;
  onChangePeriod: (period: string) => void;
  startDate?: string;
  endDate?: string;
  onChangeDateRange?: (startDate: string, endDate: string) => void;
}

const ReportFilterBar: React.FC<ReportFilterBarProps> = ({
  period,
  onChangePeriod,
  startDate,
  endDate,
  onChangeDateRange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate || "");
  const [tempEndDate, setTempEndDate] = useState(endDate || "");
  const [dateError, setDateError] = useState("");

  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  // 최대 3개월 전 날짜 계산
  const getMaxPastDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split("T")[0];
  };

  const maxPastDate = getMaxPastDate();

  // 날짜 유효성 검사
  const validateDateRange = (start: string, end: string): string => {
    if (!start || !end) {
      return "시작일과 종료일을 모두 선택해주세요.";
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const maxPast = new Date(maxPastDate);
    const todayDate = new Date(today);

    // 시작일이 종료일보다 늦은 경우
    if (startDate > endDate) {
      return "시작일은 종료일보다 이전이어야 합니다.";
    }

    // 시작일이 3개월 이전인 경우
    if (startDate < maxPast) {
      return "최대 3개월 이전 데이터까지만 조회할 수 있습니다.";
    }

    // 종료일이 오늘보다 이후인 경우
    if (endDate > todayDate) {
      return "종료일은 오늘 날짜를 초과할 수 없습니다.";
    }

    // 기간이 3개월을 초과하는 경우
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      return "조회 기간은 최대 3개월(90일)까지 가능합니다.";
    }

    return "";
  };

  const handlePeriodChange = (newPeriod: string) => {
    onChangePeriod(newPeriod);
    if (newPeriod !== "custom") {
      setShowDatePicker(false);
      setDateError("");
    } else {
      setShowDatePicker(true);
    }
  };

  const handleApplyDateRange = () => {
    const error = validateDateRange(tempStartDate, tempEndDate);
    
    if (error) {
      setDateError(error);
      return;
    }

    setDateError("");
    onChangeDateRange?.(tempStartDate, tempEndDate);
    setShowDatePicker(false);
  };

  const handleCancelDateRange = () => {
    setTempStartDate(startDate || "");
    setTempEndDate(endDate || "");
    setDateError("");
    setShowDatePicker(false);
    onChangePeriod("30days");
  };

  // 기간 표시 텍스트
  const getPeriodText = () => {
    if (period === "custom" && startDate && endDate) {
      return `${startDate} ~ ${endDate}`;
    }
    return period === "30days" ? "최근 30일" : "최근 7일";
  };

  return (
    <div className="mb-6">
      {/* 기간 선택 버튼 */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">조회 기간:</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePeriodChange("30days")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              period === "30days"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            최근 30일
          </button>

          <button
            onClick={() => handlePeriodChange("7days")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              period === "7days"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            최근 7일
          </button>

          <button
            onClick={() => handlePeriodChange("custom")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              period === "custom"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            특정 기간
          </button>
        </div>

        {period === "custom" && startDate && endDate && !showDatePicker && (
          <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-xs text-blue-800 font-medium">
              {getPeriodText()}
            </span>
          </div>
        )}
      </div>

      {/* 날짜 선택 영역 */}
      {showDatePicker && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            {/* 날짜 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  시작일
                </label>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  min={maxPastDate}
                  max={today}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  종료일
                </label>
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  min={maxPastDate}
                  max={today}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {dateError && (
              <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{dateError}</p>
              </div>
            )}

            {/* 안내 메시지 */}
            <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">조회 기간 제한 안내</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                  <li>최대 3개월(90일) 이전 데이터까지 조회 가능합니다.</li>
                  <li>한 번에 조회할 수 있는 기간은 최대 3개월입니다.</li>
                  <li>종료일은 오늘 날짜를 초과할 수 없습니다.</li>
                </ul>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDateRange}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleApplyDateRange}
                className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFilterBar;