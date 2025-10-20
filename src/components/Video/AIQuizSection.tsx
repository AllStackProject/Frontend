import React, { useState } from 'react';
import { Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: boolean; // true = O, false = X
}

interface Quiz {
  questions: QuizQuestion[];
}

interface AIQuizSectionProps {
  quiz: Quiz;
  isOpen: boolean;
  onToggle: () => void;
}

const AIQuizSection: React.FC<AIQuizSectionProps> = ({ quiz, isOpen, onToggle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(boolean | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionSelect = (answer: boolean) => {
    if (isSubmitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const allAnswered = selectedAnswers.every(answer => answer !== null);
    if (!allAnswered) {
      alert('모든 문제에 답변해주세요!');
      return;
    }
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setShowResults(false);
    setIsSubmitted(false);
  };

  const currentQ = quiz.questions[currentQuestion];
  const score = calculateScore();

  return (
    <div className="ai-quiz-section bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-6 py-[18px] cursor-pointer border-b border-gray-200 hover:bg-[#F5F0CD] transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <img
            src="/quiz-icon.png"
            alt="AI 퀴즈"
            className="w-[100px] object-contain translate-y-[-3px]"
          />
        </div>
        <button className="text-[#3674B5] text-base hover:scale-110 transition-transform">
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {/* 콘텐츠 */}
      {isOpen && (
        <div className="quiz-content px-6 pb-6 bg-[#F9FAFB]">
          {!showResults ? (
            <>
              {/* 진행 상태 */}
              <div className="quiz-progress mb-6 text-center">
                <div className="flex justify-center gap-3 mb-3">
                  {quiz.questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm cursor-pointer transition-all 
                        ${index === currentQuestion ? 'bg-[#3674B5] text-white scale-110 shadow-md' : ''}
                        ${selectedAnswers[index] !== null && index !== currentQuestion ? 'bg-[#F5F0CD] text-[#3674B5]' : ''}
                        ${selectedAnswers[index] === null && index !== currentQuestion ? 'bg-gray-200 text-gray-400' : ''}
                      `}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  문제 {currentQuestion + 1} / {quiz.questions.length}
                </p>
              </div>

              {/* 질문 */}
              <div className="quiz-question-box">
                <h3 className="text-lg font-semibold text-gray-900 bg-white p-4 rounded-lg border-l-4 border-[#3674B5] shadow-sm mb-6">
                  {currentQ.question}
                </h3>

                {/* OX 선택 */}
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    className={`w-44 h-28 rounded-xl border-2 flex flex-col items-center justify-center text-5xl font-bold transition-all ${
                      selectedAnswers[currentQuestion] === true
                        ? 'bg-[#F5F0CD] border-[#3674B5] text-[#3674B5]'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#3674B5]'
                    }`}
                    onClick={() => handleOptionSelect(true)}
                    disabled={isSubmitted}
                  >
                    O
                  </button>
                  <button
                    className={`w-44 h-28 rounded-xl border-2 flex flex-col items-center justify-center text-5xl font-bold transition-all ${
                      selectedAnswers[currentQuestion] === false
                        ? 'bg-[#FEF2F2] border-[#E25A5A] text-[#E25A5A]'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#E25A5A]'
                    }`}
                    onClick={() => handleOptionSelect(false)}
                    disabled={isSubmitted}
                  >
                    X
                  </button>
                </div>

                {/* 네비게이션 */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:border-[#3674B5] hover:text-[#3674B5] disabled:opacity-50"
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                  >
                    이전
                  </button>

                  {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                      className="flex-1 py-3 bg-gradient-to-r from-[#3674B5] to-[#578FCA] text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
                      onClick={handleSubmit}
                      disabled={isSubmitted}
                    >
                      {isSubmitted ? '제출완료' : '제출하기'}
                    </button>
                  ) : (
                    <button
                      className="flex-1 py-3 bg-gradient-to-r from-[#3674B5] to-[#578FCA] text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
                      onClick={handleNext}
                    >
                      다음
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* 결과 화면 */
            <div className="text-center">
              <Award size={48} className="text-[#FADA7A] mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 완료!</h3>
              <p className="text-lg font-semibold text-[#3674B5] mb-1">
                {score} / {quiz.questions.length} 정답
              </p>
              <p className="text-gray-600 mb-6">
                정답률 {Math.round((score / quiz.questions.length) * 100)}%
              </p>

              <button
                onClick={resetQuiz}
                className="w-full py-3 bg-gradient-to-r from-[#3674B5] to-[#578FCA] text-white font-semibold rounded-lg shadow-md hover:-translate-y-0.5 transition-all"
              >
                다시 풀기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuizSection;