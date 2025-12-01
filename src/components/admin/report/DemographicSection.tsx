import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { UserCircle, Users } from "lucide-react";
import { fetchAgeReport, fetchGenderReport } from "@/api/adminStats/report";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// 색상
const GENDER_COLORS = ["#3b82f6", "#ec4899"];

// 커스텀 파이 차트 레이블
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-sm font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-800 mb-1">{d.name}</p>
        <p className="text-sm text-gray-600">
          인원: <span className="font-bold text-gray-800">{d.value}명</span>
        </p>
        {d.payload.percentage && (
          <p className="text-xs text-gray-500 mt-1">
            비율: {d.payload.percentage}%
          </p>
        )}
      </div>
    );
  }
  return null;
};


const DemographicSection: React.FC = () => {
  const { orgId } = useAuth();

  const [genderData, setGenderData] = useState<any[]>([]);
  const [ageData, setAgeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로딩
  useEffect(() => {
    if (!orgId) return;

    const load = async () => {
      try {
        const gender = await fetchGenderReport(orgId);
        const age = await fetchAgeReport(orgId);

        const totalGender = gender.male + gender.female;

        setGenderData([
          { name: "남성", value: gender.male, percentage: Math.round((gender.male / totalGender) * 100) || 0 },
          { name: "여성", value: gender.female, percentage: Math.round((gender.female / totalGender) * 100) || 0 },
        ]);

        const ageList = [
          { range: "10대", count: age.ten },
          { range: "20대", count: age.twenty },
          { range: "30대", count: age.thirty },
          { range: "40대", count: age.forty },
          { range: "50대", count: age.fifty },
          { range: "60대+", count: age.sixty },
        ];

        const totalAge = ageList.reduce((sum, v) => sum + v.count, 0);

        setAgeData(
          ageList.map(a => ({
            ...a,
            percentage: totalAge ? Math.round((a.count / totalAge) * 100) : 0,
          }))
        );
      } catch (err) {
        console.error("통계 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  const totalMembers = genderData.reduce((sum, g) => sum + g.value, 0);

  if (loading) <LoadingSpinner text="로딩 중..." />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UserCircle size={20} className="text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">조직 멤버 통계</h3>
        </div>
        <p className="text-sm text-gray-600">
          조직 멤버의 성별 및 연령대 분포를 확인합니다.
        </p>
      </div>

      {/* 총 인원 */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
        <p className="text-sm text-purple-600 mb-1">총 멤버 수</p>
        <p className="text-xl font-bold text-purple-600">{totalMembers}명</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 성별 분포 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100">
              <Users size={18} className="text-pink-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">성별 분포</p>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
                label={renderCustomLabel}
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 연령대 분포 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
              <UserCircle size={18} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">연령대 분포</p>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {ageData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      i === 0 ? "#3b82f6" :
                      i === 1 ? "#8b5cf6" :
                      i === 2 ? "#ec4899" :
                      i === 3 ? "#f97316" :
                      i === 4 ? "#10b981" : "#6b7280"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DemographicSection;