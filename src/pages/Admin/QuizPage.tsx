import React from "react";
import QuizSection from "@/components/Admin/Quiz/QuizSection";

const QuizPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">AI 퀴즈 관리</h1>
      <QuizSection />
    </div>
  );
};

export default QuizPage;