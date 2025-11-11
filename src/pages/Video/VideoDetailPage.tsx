import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";
import CommentSection from "@/components/video/CommentSection";
import AIQuizSection from "@/components/video/AIQuizSection";
import { startVideoSession } from "@/api/video/getvideo";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const orgId = Number(localStorage.getItem("org_id"));

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        if (!orgId || !id) {
          setError("조직 정보 또는 비디오 ID가 올바르지 않습니다.");
          return;
        }

        const data = await startVideoSession(orgId, Number(id));
        setSessionData(data);
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
  const quizzes = sessionData.quizzes || [];
  const showComments = sessionData.is_comment === true;
  const hashtags = sessionData.hashtags || [];

  return (
    <div className="w-full min-h-screen bg-page px-5 md:px-8 py-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* 동영상 + 댓글 */}
        <div className="flex flex-col gap-6">
          <VideoPlayer videoUrl={video.url || video.video_url || ""} />

          {/* 댓글 보이기 여부 */}
          {showComments && <CommentSection
            orgId={orgId}
            videoId={video.id}
            initialComments={comments}
          />}
        </div>

        {/* 동영상 정보 + AI 퀴즈 */}
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

          <AIQuizSection
            quiz={{ questions: quizzes }}
            isOpen={isQuizOpen}
            onToggle={() => setIsQuizOpen(!isQuizOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;