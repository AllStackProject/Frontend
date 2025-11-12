import React, { useState } from "react";
import { CheckCircle, XCircle, Award, HelpCircle } from "lucide-react";
import ConfirmActionModal from "@/components/common/modals/ConfirmActionModal";
import {startVideoSession} from "@/api/video/getvideo";

interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: boolean;
}

interface Quiz {
  questions: QuizQuestion[];
}

interface AIQuizSectionProps {
  quiz: Quiz;
  isOpen: boolean;
  onToggle: () => void;
}

const AIQuizSection: React.FC<AIQuizSectionProps> = ({
  quiz,
  isOpen,
  onToggle,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(boolean | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 에러 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleOptionSelect = (answer: boolean) => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = () => {
    const allAnswered = selectedAnswers.every((a) => a !== null);
    if (!allAnswered) {
      // 에러 모달 표시
      setShowErrorModal(true);
      return;
    }
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () =>
    selectedAnswers.reduce(
      (acc, a, i) => (a === quiz.questions[i].correctAnswer ? acc + 1 : acc),
      0
    );

  const currentQ = quiz.questions[currentQuestion];
  const score = calculateScore();

  return (
    <>
      <div className="bg-bg-card border border-border-light rounded-xl shadow-base overflow-hidden">
        {/* 헤더 */}
        <div
          className="flex justify-between items-center px-6 py-4 border-b border-border-light hover:bg-border-strong cursor-pointer transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="text-primary" size={22} />
            <p className="text-lg font-semibold text-text-primary">AI 퀴즈</p>
          </div>

          <button className="text-text-link text-lg md:text-xl hover:scale-110 transition-transform">
            {isOpen ? "▼" : "▶"}
          </button>
        </div>

        {/* 내용 */}
        {isOpen && (
          <div className="bg-bg-page p-6">
            {!showResults ? (
              <>
                {/* 진행상태 */}
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-3 mb-3">
                    {quiz.questions.map((_, i) => {
                      const isAnswered = selectedAnswers[i] !== null;
                      const isActive = i === currentQuestion;
                      return (
                        <div
                          key={i}
                          className={`w-7 h-7 flex items-center justify-center rounded-full font-semibold text-sm cursor-pointer transition-all
                        ${
                            isActive
                              ? "bg-primary text-white scale-110 shadow-base"
                              : isAnswered
                              ? "bg-accent-light text-primary"
                              : "bg-gray-200 text-gray-400"
                          }
                        hover:scale-105`}
                          onClick={() => setCurrentQuestion(i)}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 문제 */}
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-4 p-3 bg-white rounded-lg border-l-4 border-primary shadow-sm leading-relaxed">
                    {currentQ.question}
                  </h3>

                  {/* OX 버튼 */}
                  <div className="flex justify-center gap-4 mb-4">
                    {/* O 버튼 */}
                    <button
                      className={`flex flex-col items-center justify-center gap-2 relative w-full max-w-[100px] h-[70px] border-[3px] rounded-xl bg-white transition-all
                    ${
                        selectedAnswers[currentQuestion] === true
                          ? "border-primary bg-accent-light"
                          : "border-border-light"
                      }
                    ${
                        isSubmitted && currentQ.correctAnswer === true
                          ? "border-success bg-green-50"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === true &&
                            currentQ.correctAnswer === false
                          ? "border-error bg-red-50"
                          : ""
                      }
                    hover:scale-105`}
                      onClick={() => handleOptionSelect(true)}
                      disabled={isSubmitted}
                    >
                      <span
                        className={`text-3xl font-extrabold ${
                          isSubmitted && currentQ.correctAnswer === true
                            ? "text-success"
                            : isSubmitted &&
                              selectedAnswers[currentQuestion] === true &&
                              currentQ.correctAnswer === false
                            ? "text-error"
                            : "text-primary"
                        }`}
                      >
                        O
                      </span>
                      {isSubmitted &&
                        (currentQ.correctAnswer === true ? (
                          <CheckCircle
                            size={22}
                            className="absolute top-3 right-3 text-success"
                          />
                        ) : (
                          selectedAnswers[currentQuestion] === true && (
                            <XCircle
                              size={22}
                              className="absolute top-3 right-3 text-error"
                            />
                          )
                        ))}
                    </button>

                    {/* X 버튼 */}
                    <button
                      className={`flex flex-col items-center justify-center gap-2 relative w-full max-w-[100px] h-[70px] border-[3px] rounded-2xl bg-white transition-all
                    ${
                        selectedAnswers[currentQuestion] === false
                          ? "border-error bg-red-50"
                          : "border-border-light"
                      }
                    ${
                        isSubmitted && currentQ.correctAnswer === false
                          ? "border-success bg-green-50"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === false &&
                            currentQ.correctAnswer === true
                          ? "border-error bg-red-50"
                          : ""
                      }
                    hover:scale-105`}
                      onClick={() => handleOptionSelect(false)}
                      disabled={isSubmitted}
                    >
                      <span
                        className={`text-3xl font-extrabold ${
                          isSubmitted && currentQ.correctAnswer === false
                            ? "text-success"
                            : isSubmitted &&
                              selectedAnswers[currentQuestion] === false &&
                              currentQ.correctAnswer === true
                            ? "text-error"
                            : "text-error"
                        }`}
                      >
                        X
                      </span>
                      {isSubmitted &&
                        (currentQ.correctAnswer === false ? (
                          <CheckCircle
                            size={22}
                            className="absolute top-3 right-3 text-success"
                          />
                        ) : (
                          selectedAnswers[currentQuestion] === false && (
                            <XCircle
                              size={22}
                              className="absolute top-3 right-3 text-error"
                            />
                          )
                        ))}
                    </button>
                  </div>

                  {/* 네비게이션 */}
                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 bg-white text-text-primary font-semibold text-sm border-2 border-border-light rounded-lg transition-all hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePrev}
                      disabled={currentQuestion === 0}
                    >
                      이전
                    </button>

                    {currentQuestion === quiz.questions.length - 1 ? (
                      <button
                        className="flex-1 py-3 text-white font-semibold text-base rounded-lg shadow-md bg-gradient-to-r from-primary to-primary-light transition-all hover:-translate-y-[2px] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isSubmitted}
                      >
                        {isSubmitted ? "채점완료" : "채점하기"}
                      </button>
                    ) : (
                      <button
                        className="flex-1 py-3 text-white font-semibold text-base rounded-lg bg-gradient-to-r from-primary to-primary-light transition-all hover:-translate-y-[2px] hover:shadow-lg"
                        onClick={handleNext}
                      >
                        다음
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // 결과 화면
              <div>
                <div className="text-center bg-white p-5 rounded-xl mb-6">
                  <p className="text-lg font-extrabold text-primary mb-2">
                    퀴즈 {quiz.questions.length}개 중 {score}개 정답
                  </p>
                  <p className="text-text-secondary">
                    정답률: {Math.round((score / quiz.questions.length) * 100)}
                    %
                  </p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {quiz.questions.map((q, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setShowResults(false);
                        setCurrentQuestion(i);
                      }}
                      className="flex items-center gap-3 p-4 bg-white rounded-lg cursor-pointer transition-all hover:shadow-md hover:translate-x-1"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-light text-primary flex items-center justify-center font-bold flex-shrink-0">
                        Q{i + 1}
                      </div>
                      {selectedAnswers[i] === q.correctAnswer ? (
                        <CheckCircle size={20} className="text-success" />
                      ) : (
                        <XCircle size={20} className="text-error" />
                      )}
                      <p className="flex-1 text-sm text-text-primary leading-snug">
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="답변 미완료"
          message="모든 문제에 답변해주세요!"
          confirmText="확인"
          color="yellow"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default AIQuizSection;