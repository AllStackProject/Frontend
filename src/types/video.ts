export interface WatchedVideo {
  id: number;
  name: string;
  img: string;
  watch_rate: number;
  recent_watch: string;
  whole_time: number;
  is_scrapped?: boolean;
}

/**
 * 비디오 상세 세션 응답 타입
 */
export interface StartVideoSessionResponse {
  code: number;
  status: string;
  message: string;
  result: StartVideoSessionResult;
}

export interface StartVideoSessionResult {
  session_id: string;
  watch_completed: boolean;

  video: {
    id: number;
    title: string;
    description: string; 
    watch_cnt: number;
    whole_time: number;
    created_at: string;
  };

  seg_view_cnts: number[];

  is_comment: boolean;
  is_scrapped: boolean;
  categories: string[];

  comments: {
    id: number;
    text: string;
    creator: string;
    created_at: string;
  }[];

  /** AI 타입: QUIZ / FEEDBACK / SUMMARY */
  ai_type: "QUIZ" | "FEEDBACK" | "SUMMARY" | null;

  /** AI 퀴즈 */
  ai_quizzes: {
    id: number;
    question: string;
    correctAnswer: boolean;
  }[];

  /** AI 피드백 */
  ai_feedback: string;

  /** AI 요약 */
  ai_summary: string;

  created_at: string;
}