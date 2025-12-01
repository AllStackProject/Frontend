import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";
import CommentSection from "@/components/video/CommentSection";
import AIQuizSection from "@/components/video/AIQuizSection";
import AIFeedbackSection from "@/components/video/AIFeedbackSection";
import AISummarySection from "@/components/video/AISummarySection";
import { startVideoSession } from "@/api/video/video";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const VideoDetailPage: React.FC = () => {
  const { orgId } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // AI 섹션 토글 상태
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        if (!orgId || !id) {
          setError("조직 정보 또는 비디오 ID가 올바르지 않습니다.");
          return;
        }

        const data = await startVideoSession(orgId, Number(id));

        const result = data;
        setSessionData({
          ...result,
          ai_type: result.ai_type ?? null,
          quizzes: result.ai_quizzes ?? [],
          feedback: result.ai_feedback ?? "",
          summary: result.ai_summary ?? "",
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

  if (loading) <LoadingSpinner text="불러오는 중..." />

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!sessionData)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        아직 데이터가 없습니다.
      </div>
    );

  // ====== API 데이터 구조 분리 ======
  const playbackUrl =
    sessionData.playback_url.startsWith("http")
      ? sessionData.playback_url
      : `https://${sessionData.playback_url}`;

  const video = sessionData.video;
  const comments = sessionData.comments || [];
  const categories = sessionData.categories || [];
  const showComments = sessionData.is_comment === true;

  const quizzes = sessionData.quizzes || [];
  const feedbackText = sessionData.feedback || "";
  const summaryText = sessionData.summary || "";
  const ai_type = sessionData.ai_type; // QUIZ | FEEDBACK | SUMMARY

  return (
    <div className="w-full min-h-screen bg-page px-4 sm:px-5 py-3">
      <div
        className="
      max-w-[1400px] mx-auto 
      grid grid-cols-1 
      lg:grid-cols-[1fr_340px] 
      gap-6
    "
      >
        {/* ===========================
        1) LEFT SECTION
        Video + Comments
        ============================ */}
        <div className="flex flex-col gap-6">

          {/* Video Player */}
          <VideoPlayer
            videoUrl={playbackUrl}
            videoId={video.id}
            orgId={orgId || 0}
            sessionId={sessionData.session_id}
            wholeTime={video.whole_time}
            heatmapCounts={sessionData.seg_view_cnts}
          />

          {/* (모바일 전용) VideoInfo */}
          <div className="lg:hidden">
            <VideoInfo
              orgId={orgId || 0}
              videoId={video.id}
              title={video.title}
              description={video.description}
              views={video.watch_cnt}
              uploadDate={new Date(video.created_at).toLocaleDateString("ko-KR")}
              categories={categories}
              initialFavorite={sessionData.is_scrapped}
            />
          </div>

          {/* Comments */}
          {showComments && (
            <CommentSection
              orgId={orgId || 0}
              videoId={video.id}
              initialComments={comments}
            />
          )}

          {/* (모바일 전용) AI Section */}
          <div className="lg:hidden flex flex-col gap-4">
            {ai_type === "QUIZ" && (
              <AIQuizSection
                quiz={{ questions: quizzes }}
                isOpen={isQuizOpen}
                onToggle={() => setIsQuizOpen(!isQuizOpen)}
              />
            )}

            {ai_type === "FEEDBACK" && (
              <AIFeedbackSection
                feedback={feedbackText}
                isOpen={isFeedbackOpen}
                onToggle={() => setIsFeedbackOpen(!isFeedbackOpen)}
              />
            )}

            {ai_type === "SUMMARY" && (
              <AISummarySection
                summary={summaryText}
                isOpen={isSummaryOpen}
                onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
              />
            )}
          </div>
        </div>

        {/* ===========================
        2) RIGHT SECTION (DESKTOP ONLY)
        ============================ */}
        <div className="hidden lg:flex flex-col gap-4">
          <VideoInfo
            orgId={orgId || 0}
            videoId={video.id}
            title={video.title}
            description={video.description}
            views={video.watch_cnt}
            uploadDate={new Date(video.created_at).toLocaleDateString("ko-KR")}
            categories={categories}
            initialFavorite={sessionData.is_scrapped}
          />

          {ai_type === "QUIZ" && (
            <AIQuizSection
              quiz={{ questions: quizzes }}
              isOpen={isQuizOpen}
              onToggle={() => setIsQuizOpen(!isQuizOpen)}
            />
          )}

          {ai_type === "FEEDBACK" && (
            <AIFeedbackSection
              feedback={feedbackText}
              isOpen={isFeedbackOpen}
              onToggle={() => setIsFeedbackOpen(!isFeedbackOpen)}
            />
          )}

          {ai_type === "SUMMARY" && (
            <AISummarySection
              summary={summaryText}
              isOpen={isSummaryOpen}
              onToggle={() => setIsSummaryOpen(!isSummaryOpen)}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default VideoDetailPage;