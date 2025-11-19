import React from "react";
import { Users, PlayCircle, BarChart3, Award } from "lucide-react";

const OverviewSection: React.FC = () => {
  const stats = [
    { 
      icon: Users, 
      label: "총 멤버 수", 
      value: "128", 
      unit: "명",
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    { 
      icon: PlayCircle, 
      label: "총 시청 조회 수", 
      value: "842", 
      unit: "회",
      bgColor: "bg-green-50", 
      iconColor: "text-green-600",
      trend: "+8%",
      trendUp: true
    },
    { 
      icon: BarChart3, 
      label: "평균 시청률", 
      value: "78", 
      unit: "%",
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600",
      trend: "+5%",
      trendUp: true
    },
    { 
      icon: Award, 
      label: "평균 퀴즈 정답률", 
      value: "82", 
      unit: "%",
      bgColor: "bg-amber-50", 
      iconColor: "text-amber-600",
      trend: "-3%",
      trendUp: false
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 아이콘과 트렌드 */}
              <div className="flex items-start justify-between mb-3">
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon size={20} className={stat.iconColor} />
                </div>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  stat.trendUp 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {stat.trend}
                </span>
              </div>

              {/* 레이블 */}
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>

              {/* 값 */}
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <span className="text-sm text-gray-500">{stat.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewSection;