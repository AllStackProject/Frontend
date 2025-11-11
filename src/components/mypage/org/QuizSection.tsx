import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  XCircle,
  CheckCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { getQuizHistory } from "@/api/myactivity/getQuizHistory";
import { useAuth } from "@/context/AuthContext";

interface QuizQuestion {
  question: string;
  correctAnswer: boolean;
  userAnswer: boolean;
  explanation: string;
}

interface QuizResult {
  id: number;
  videoId: number;
  videoTitle: string;
  organization: string;
  organizationLogo?: string;
  correct: number;
  total: number;
  questions: QuizQuestion[];
}

const QuizSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { orgId, orgName } = useAuth();

  // 🔹 API 호출 (getQuizHistory)
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!orgId) {
          setError("조직이 선택되지 않았습니다. 조직을 먼저 선택해주세요.");
          setLoading(false);
          return;
        }

        const data = await getQuizHistory(orgId);

        // API 스펙에 맞게 데이터 매핑
        const transformedData: QuizResult[] = data.map((item, index) => ({
          id: index + 1,
          videoId: index + 100, // 실제 videoId가 응답에 없으면 임시 생성
          videoTitle: item.video_name,
          organization: orgName || "현재 조직",
          correct: item.quiz.filter((q) => q.is_correct).length,
          total: item.quiz.length,
          questions: item.quiz.map((q) => ({
            question: q.question,
            correctAnswer: q.is_correct,
            userAnswer: q.answer,
            explanation: q.description || "",
          })),
        }));

        setQuizResults(transformedData);
      } catch (err: any) {
        console.error("🚨 퀴즈 데이터 조회 오류:", err);
        setError(
          err?.message || "AI 퀴즈 기록을 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [orgId, orgName]);

  const filteredQuizResults = quizResults.filter(
    (quiz) => quiz.organization === orgName
  );

  const averageScore =
    filteredQuizResults.length > 0
      ? Math.round(
          (filteredQuizResults.reduce((sum, quiz) => sum + quiz.correct, 0) /
            filteredQuizResults.reduce((sum, quiz) => sum + quiz.total, 0)) *
            100
        )
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 text-sm">{error}</div>
    );
  }

  if (filteredQuizResults.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border-light">
        <Brain className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-text-muted text-sm">
          {orgName}에서 푼 AI 퀴즈가 없습니다.
        </p>
        <p className="text-text-muted text-xs mt-2">
          동영상을 시청하고 퀴즈를 풀어보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 타이틀 + 평균 정답률 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">
            AI 퀴즈 오답노트
          </h2>
          <span className="text-sm text-text-muted">
            ({filteredQuizResults.length}개)
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
          <Brain className="text-primary" size={20} />
          <span className="text-sm font-semibold text-primary">
            평균 정답률: {averageScore}%
          </span>
        </div>
      </div>

      {/* 퀴즈 목록 */}
      {filteredQuizResults.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white border border-border-light rounded-lg shadow-base p-5 transition-all duration-200"
        >
          {/* 제목/점수 */}
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

          {/* 상세 보기 */}
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

              {quiz.correct === quiz.total && (
                <div className="flex items-center gap-2 text-success text-sm bg-green-50 border border-success rounded-md p-3">
                  <CheckCircle size={18} />
                  <p>모든 문제를 맞췄습니다! 🎉</p>
                </div>
              )}

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
      ))}
    </div>
  );
};

export default QuizSection;