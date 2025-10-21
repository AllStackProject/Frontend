import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

interface QuizResult {
  id: number;
  videoId: number;
  videoTitle: string;
  organization: string;
  organizationLogo?: string;
  correct: number;
  total: number;
  questions: {
    question: string;
    correctAnswer: boolean;
    userAnswer: boolean;
    explanation: string;
  }[];
}

const QuizSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const navigate = useNavigate();

  // 현재 접속한 조직 (추후 Context나 Redux에서 가져올 예정)
  const currentOrgName = "우리 FISA"; // 또는 localStorage.getItem('currentOrg')

  // 예시 데이터 (API 연동 시 교체 예정)
  const quizResults: QuizResult[] = [
    {
      id: 1,
      videoId: 101,
      videoTitle: "AI 개념과 적용 사례",
      organization: "우리 FISA",
      organizationLogo: "/woori-logo.png",
      correct: 2,
      total: 3,
      questions: [
        {
          question: "머신러닝은 데이터를 사용하지 않는다.",
          correctAnswer: false,
          userAnswer: true,
          explanation:
            "AI는 데이터를 기반으로 학습하므로, 머신러닝은 데이터를 반드시 사용합니다.",
        },
        {
          question: "딥러닝은 인공신경망 기반의 학습 방법이다.",
          correctAnswer: true,
          userAnswer: true,
          explanation: "올바른 답변입니다!",
        },
        {
          question: "강화학습은 지도학습의 한 종류이다.",
          correctAnswer: false,
          userAnswer: true,
          explanation:
            "강화학습은 보상 기반의 자율적 학습 방식이며, 지도학습과는 다릅니다.",
        },
      ],
    },
    {
      id: 2,
      videoId: 102,
      videoTitle: "딥러닝 네트워크 이해",
      organization: "우리 FISA",
      organizationLogo: "/woori-logo.png",
      correct: 3,
      total: 3,
      questions: [
        {
          question: "CNN은 영상 인식에 주로 사용된다.",
          correctAnswer: true,
          userAnswer: true,
          explanation: "올바른 답변입니다!",
        },
        {
          question: "RNN은 순차 데이터를 처리하기에 적합하다.",
          correctAnswer: true,
          userAnswer: true,
          explanation: "정답입니다.",
        },
        {
          question: "딥러닝은 shallow learning보다 많은 층을 가진다.",
          correctAnswer: true,
          userAnswer: true,
          explanation: "모두 맞았습니다! 🎉",
        },
      ],
    },
    {
      id: 3,
      videoId: 103,
      videoTitle: "자연어 처리 기초",
      organization: "PASTA EDU",
      organizationLogo: "/woori-logo.png",
      correct: 1,
      total: 3,
      questions: [
        {
          question: "NLP는 자연어 처리를 의미한다.",
          correctAnswer: true,
          userAnswer: false,
          explanation: "NLP는 Natural Language Processing의 약자입니다.",
        },
        {
          question: "BERT는 트랜스포머 기반 모델이다.",
          correctAnswer: true,
          userAnswer: true,
          explanation: "정답입니다!",
        },
        {
          question: "Word2Vec은 최신 언어 모델이다.",
          correctAnswer: false,
          userAnswer: true,
          explanation: "Word2Vec은 초기 임베딩 방법으로, 최신 모델은 아닙니다.",
        },
      ],
    },
  ];

  // 현재 조직의 퀴즈 결과만 필터링
  const filteredQuizResults = quizResults.filter(
    (quiz) => quiz.organization === currentOrgName
  );

  // 평균 정답률 계산
  const averageScore =
    filteredQuizResults.length > 0
      ? Math.round(
          (filteredQuizResults.reduce((sum, quiz) => sum + quiz.correct, 0) /
            filteredQuizResults.reduce((sum, quiz) => sum + quiz.total, 0)) *
            100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* 타이틀 + 조직 정보 + 평균 정답률 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">AI 퀴즈 오답노트</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary-light rounded-full">
            <img
              src="/woori-logo.png"
              alt={currentOrgName}
              className="w-5 h-5 rounded object-cover"
            />
            <span className="text-sm font-medium text-bg-page">{currentOrgName}</span>
          </div>
          {filteredQuizResults.length > 0 && (
            <span className="text-sm text-text-muted">
              ({filteredQuizResults.length}개)
            </span>
          )}
        </div>

        {/* 평균 정답률 */}
        {filteredQuizResults.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <Brain className="text-primary" size={20} />
            <span className="text-sm font-semibold text-primary">
              평균 정답률: {averageScore}%
            </span>
          </div>
        )}
      </div>

      {/* 퀴즈 결과가 없는 경우 */}
      {filteredQuizResults.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-border-light">
          <Brain className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-text-muted text-sm">
            {currentOrgName}에서 푼 AI 퀴즈가 없습니다.
          </p>
          <p className="text-text-muted text-xs mt-2">
            동영상을 시청하고 퀴즈를 풀어보세요!
          </p>
        </div>
      ) : (
        filteredQuizResults.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white border border-border-light rounded-lg shadow-base p-5 transition-all duration-200"
          >
            {/* 상단 제목 / 점수 */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setOpenId(openId === quiz.id ? null : quiz.id)}
            >
              <div>
                <h3 className="font-semibold text-text-primary text-lg">
                  {quiz.videoTitle}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  정답률:{" "}
                  <span className="text-primary font-medium">
                    {Math.round((quiz.correct / quiz.total) * 100)}%
                  </span>{" "}
                  ({quiz.correct}/{quiz.total})
                </p>
              </div>
              {openId === quiz.id ? (
                <ChevronUp className="text-primary" />
              ) : (
                <ChevronDown className="text-primary" />
              )}
            </div>

            {/* 펼친 상태 */}
            {openId === quiz.id && (
              <div className="mt-5 border-t border-border-light pt-4 space-y-4">
                {quiz.questions.map((q, i) => {
                  const isCorrect = q.correctAnswer === q.userAnswer;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "border-success bg-green-50"
                          : "border-error bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="text-success" size={20} />
                        ) : (
                          <XCircle className="text-error" size={20} />
                        )}
                        <p className="font-medium text-text-primary">
                          Q{i + 1}. {q.question}
                        </p>
                      </div>

                      {/* ✅ AI 해설 (오답만 표시) */}
                      {!isCorrect && (
                        <div className="mt-2 bg-white border border-border-light rounded-md p-3 flex items-start gap-2">
                          <Brain className="text-primary mt-0.5" size={18} />
                          <p className="text-sm text-text-secondary leading-relaxed">
                            <strong className="text-primary">AI 해설:</strong>{" "}
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* ✅ 모든 문제 정답 시 */}
                {quiz.correct === quiz.total && (
                  <div className="flex items-center gap-2 text-success text-sm bg-green-50 border border-success rounded-md p-3">
                    <CheckCircle size={18} />
                    <p>모든 문제를 맞췄습니다! 🎉</p>
                  </div>
                )}

                {/* ✅ 동영상 보러가기 버튼 */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate(`/video/${quiz.videoId}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition font-semibold"
                  >
                    <PlayCircle size={18} />
                    동영상 보러가기
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default QuizSection;