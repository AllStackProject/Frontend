import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoInfo from "@/components/video/VideoInfo";
import CommentSection from "@/components/video/CommentSection";
import AIQuizSection from "@/components/video/AIQuizSection";

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // 임시 데이터
  const videoData = {
    id: id || "1",
    title: "[보안교육] 사이버 보안 위협, 일단 어떤 위협이 있는지 알아야 대비하지 않겠어??!",
    channel: "우리 FISA",
    views: 1234,
    description: "소오름… 세상이 편리해진다고 다 좋은 게 아니었다니ㅠㅠㅠ언제든지 우리의 일상을 파괴할 수 있는 사이버 보안 위협, 일단 어떤 위협이 있는지 알아야 대비하지 않겠어??!",
    uploadDate: "2024.01.01",
    categories: ["AI", "머신러닝", "교육", "FISA"],
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
    {
      id: 6,
      user: "김피사",
      content: "궁금하던 주제를 다룬 영상이었습니다",
      timestamp: "2시간 전",
    },
    {
      id: 7,
      user: "이박사",
      content: "댓글 내용이 들어갑니다...",
      timestamp: "5시간 전",
    },
    {
      id: 8,
      user: "정석사",
      content: "댓글 내용이 들어갑니다...",
      timestamp: "1일 전",
    },
    {
      id: 9,
      user: "김피사",
      content: "좋은 내용이네요!",
      timestamp: "2시간 전",
    },
    {
      id: 10,
      user: "이박사",
      content: "도움이 많이 되었습니다.",
      timestamp: "5시간 전",
    },
  ];

  const quizData = {
    questions: [
      {
        id: 1,
        question: "이 영상에서 다룬 주요 주제는 인공지능 기초이다. 이 영상에서 다룬 주요 주제는 인공지능 기초이다.",
        correctAnswer: true,
      },
      {
        id: 2,
        question: "영상에서 설명한 알고리즘의 시간 복잡도는 O(n²)이다. 이 영상에서 다룬 주요 주제는 인공지능 기초이다. 이 영상에서 다룬 주요 주제는 인공지능 기초이다.",
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
    <div className="w-full min-h-screen bg-page px-5 md:px-8 py-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* 동영상 + 댓글 */}
        <div className="flex flex-col gap-6">
          <VideoPlayer videoUrl={videoData.videoUrl} />
          <CommentSection comments={comments} />
        </div>

        {/* 동영상 정보 + AI 퀴즈 영역 */}
        <div className="flex flex-col gap-6">
          
          <VideoInfo
           videoId={videoData.id}
            title={videoData.title}
            channel={videoData.channel}
            description={videoData.description}
            views={videoData.views}
            uploadDate={videoData.uploadDate}
            categories={videoData.categories}
          />
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