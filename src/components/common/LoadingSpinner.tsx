import React from "react";

const LoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;