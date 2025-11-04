import React from "react";
import QuizSection from "@/components/admin/quiz/QuizSection";

const QuizPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">AI 퀴즈 관리</h1>
        <p className="text-sm text-gray-600">AI가 생성한 퀴즈 문항을 검토하고, 수정하거나 정답을 관리할 수 있습니다.</p>
      </div>
      <QuizSection />
    </div>
  );
};

export default QuizPage;