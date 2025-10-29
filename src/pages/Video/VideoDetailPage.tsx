import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../../components/Video/VideoPlayer";
import VideoInfo from "../../components/Video/VideoInfo";
import CommentSection from "../../components/Video/CommentSection";
import AIQuizSection from "../../components/Video/AIQuizSection";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // 임시 데이터
  const videoData = {
    id: id || "1",
    title: "동영상제목입니다 동영상 제목",
    channel: "우리 FISA",
    views: 1234,
    uploadDate: "2024.01.01",
    category: "해시태그",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  };

  const comments = [
    {
      id: 1,
      user: "김피사",
      content: "궁금하던 주제를 다룬 영상이었습니다",
      timestamp: "2시간 전",
    },
    {
      id: 2,
      user: "이박사",
      content: "댓글 내용이 들어갑니다...",
      timestamp: "5시간 전",
    },
    {
      id: 3,
      user: "정석사",
      content: "댓글 내용이 들어갑니다...",
      timestamp: "1일 전",
    },
    {
      id: 4,
      user: "김피사",
      content: "좋은 내용이네요!",
      timestamp: "2시간 전",
    },
    {
      id: 5,
      user: "이박사",
      content: "도움이 많이 되었습니다.",
      timestamp: "5시간 전",
    },
  ];

  const quizData = {
    questions: [
      {
        id: 1,
        question: "이 영상에서 다룬 주요 주제는 인공지능 기초이다.",
        correctAnswer: true,
      },
      {
        id: 2,
        question: "영상에서 설명한 알고리즘의 시간 복잡도는 O(n²)이다.",
        correctAnswer: false,
      },
      {
        id: 3,
        question: "프로젝트 진행 시 설계 단계가 가장 중요하다.",
        correctAnswer: true,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] px-5 md:px-8 py-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* 동영상 영역 */}
        <div className="flex flex-col gap-6">
          <VideoPlayer videoUrl={videoData.videoUrl} />
          <VideoInfo
            title={videoData.title}
            channel={videoData.channel}
            views={videoData.views}
            uploadDate={videoData.uploadDate}
            category={videoData.category}
          />
        </div>

        {/* 댓글 + AI 퀴즈 영역 */}
        <div className="flex flex-col gap-6">
          <CommentSection comments={comments} />
          <AIQuizSection
            quiz={quizData}
            isOpen={isQuizOpen}
            onToggle={() => setIsQuizOpen(!isQuizOpen)}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;