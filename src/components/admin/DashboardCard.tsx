import React from "react";

interface DashboardCardProps {
  label: string;
  value: string | number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default DashboardCard;