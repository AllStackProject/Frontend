import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";
import CommentSection from "@/components/video/CommentSection";
import AIQuizSection from "@/components/video/AIQuizSection";
import AIFeedbackSection from "@/components/video/AIFeedbackSection";
import AISummarySection from "@/components/video/AISummarySection";
import { startVideoSession } from "@/api/video/getvideo";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 각 AI 섹션 토글 상태
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const orgId = Number(localStorage.getItem("org_id"));

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        if (!orgId || !id) {
          setError("조직 정보 또는 비디오 ID가 올바르지 않습니다.");
          return;
        }

        const data = await startVideoSession(orgId, Number(id));

        // ⚡ 더미 데이터 주입 (AI 퀴즈 3문제)
        const dummyQuizzes = [
          {
            id: 1,
            question: "H.264 코덱은 영상 압축을 위한 표준 코덱이다.",
            correctAnswer: true,
          },
          {
            id: 2,
            question: "AWS S3는 영상 스트리밍을 위한 전용 트랜스코더 서비스이다.",
            correctAnswer: false,
          },
          {
            id: 3,
            question: "MediaConvert는 영상을 다른 포맷으로 변환할 때 사용된다.",
            correctAnswer: true,
          },
        ];

        setSessionData({
          ...data,
          ai_type: data.is_comment || "QUIZ", // 수정 필요 QUIZ FEEDBACK Summary
          quizzes: data.quizzes?.length ? data.quizzes : dummyQuizzes,
        });
      } catch (err: any) {
        console.error("🚨 영상 세션 시작 실패:", err);
        setError(err.message || "영상 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [orgId, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        영상 정보를 불러오는 중입니다...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!sessionData)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        데이터가 없습니다.
      </div>
    );

  const video = sessionData.video;
  const comments = sessionData.comments || [];
  const hashtags = sessionData.hashtags || [];
  const showComments = sessionData.is_comment === true;
  const quizzes = sessionData.quizzes || [];

  return (
    <div className="w-full min-h-screen bg-page px-5 md:px-8 py-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* 왼쪽: 동영상 + 댓글 */}
        <div className="flex flex-col gap-6">
          <VideoPlayer videoUrl={video.url || video.video_url || ""} />

          {showComments && (
            <CommentSection
              orgId={orgId}
              videoId={video.id}
              initialComments={comments}
            />
          )}
        </div>

        {/* 오른쪽: 정보 + AI 섹션 */}
        <div className="flex flex-col gap-6">
          <VideoInfo
            orgId={orgId}
            videoId={video.id}
            title={video.title}
            description={video.desc}
            views={video.watch_cnt}
            uploadDate={new Date(video.created_at).toLocaleDateString("ko-KR")}
            categories={hashtags}
            initialFavorite={sessionData.is_scrapped}
          />

          {/* AI 섹션 3종 토글형 */}
          <AIQuizSection
            quiz={{ questions: quizzes }}
            isOpen={isQuizOpen}
            onToggle={() => setIsQuizOpen(!isQuizOpen)}
          />

          <AIFeedbackSection
            isOpen={isFeedbackOpen}
            onToggle={() => setIsFeedbackOpen(!isFeedbackOpen)}
          />

          <AISummarySection
            isOpen={isSummaryOpen}
            onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;