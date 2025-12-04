import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useModal } from "@/context/ModalContext";

interface QuizQuestion {
  id?: number;
  question: string;
  // 백엔드 응답: answer
  answer?: boolean | string;
  // 프론트에서 매핑했을 수도 있는 필드:
  correctAnswer?: boolean | string;
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
  const { openModal } = useModal();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(boolean | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /** 퀴즈가 바뀔 때마다 상태 초기화 */
  useEffect(() => {
    const len = quiz.questions.length;
    setSelectedAnswers(new Array(len).fill(null));
    setCurrentQuestion(0);
    setShowResults(false);
    setIsSubmitted(false);
  }, [quiz]);

  /** 정답을 안전하게 boolean으로 가져오는 헬퍼 */
  const getCorrectAnswer = (index: number): boolean => {
    const q = quiz.questions[index];
    const raw =
      q.correctAnswer !== undefined && q.correctAnswer !== null
        ? q.correctAnswer
        : q.answer;

    if (typeof raw === "boolean") return raw;
    if (typeof raw === "string") {
      return raw.toLowerCase() === "true";
    }
    // 이상한 값이면 기본 false
    return false;
  };

  const handleOptionSelect = (answer: boolean) => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // null 또는 undefined인 항목이 있으면 아직 안 고른 것
    const allAnswered =
      selectedAnswers.length === quiz.questions.length &&
      selectedAnswers.every((a) => a === true || a === false);

    if (!allAnswered) {
      openModal({
        type: "error",
        title: "응답이 부족합니다",
        message: "모든 퀴즈에 대해 O 또는 X를 선택한 후 채점해주세요.",
      });
      return;
    }

    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () =>
    selectedAnswers.reduce((acc, a, i) => {
      if (a === null || a === undefined) return acc;
      const correct = getCorrectAnswer(i);
      return a === correct ? acc + 1 : acc;
    }, 0);

  if (!quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const currentQ = quiz.questions[currentQuestion];
  const score = calculateScore();

  return (
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
              {/* 진행 상태 인디케이터 */}
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
                        isSubmitted && getCorrectAnswer(currentQuestion) === true
                          ? "border-success bg-green-50"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === true &&
                            getCorrectAnswer(currentQuestion) === false
                          ? "border-error bg-red-50"
                          : ""
                      }
                      hover:scale-105`}
                    onClick={() => handleOptionSelect(true)}
                    disabled={isSubmitted}
                  >
                    <span
                      className={`text-3xl font-extrabold ${
                        isSubmitted &&
                        getCorrectAnswer(currentQuestion) === true
                          ? "text-success"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === true &&
                            getCorrectAnswer(currentQuestion) === false
                          ? "text-error"
                          : "text-primary"
                      }`}
                    >
                      O
                    </span>
                    {isSubmitted &&
                      (getCorrectAnswer(currentQuestion) === true ? (
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
                        isSubmitted && getCorrectAnswer(currentQuestion) === false
                          ? "border-success bg-green-50"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === false &&
                            getCorrectAnswer(currentQuestion) === true
                          ? "border-error bg-red-50"
                          : ""
                      }
                      hover:scale-105`}
                    onClick={() => handleOptionSelect(false)}
                    disabled={isSubmitted}
                  >
                    <span
                      className={`text-3xl font-extrabold ${
                        isSubmitted &&
                        getCorrectAnswer(currentQuestion) === false
                          ? "text-success"
                          : isSubmitted &&
                            selectedAnswers[currentQuestion] === false &&
                            getCorrectAnswer(currentQuestion) === true
                          ? "text-error"
                          : "text-error"
                      }`}
                    >
                      X
                    </span>
                    {isSubmitted &&
                      (getCorrectAnswer(currentQuestion) === false ? (
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
                  정답률:{" "}
                  {Math.round((score / quiz.questions.length) * 100)}
                  %
                </p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {quiz.questions.map((q, i) => {
                  const correct = getCorrectAnswer(i);
                  const isCorrect = selectedAnswers[i] === correct;

                  return (
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
                      {isCorrect ? (
                        <CheckCircle size={20} className="text-success" />
                      ) : (
                        <XCircle size={20} className="text-error" />
                      )}
                      <p className="flex-1 text-sm text-text-primary leading-snug">
                        {q.question}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuizSection;