/**
 * 영상 시청 기록 타입
 */
export interface WatchedVideo {
  id: number;
  name: string;
  img: string;
  watch_rate: number;
  recent_watch: string;
  whole_time: number;
  is_scrapped?: boolean;
}

/* 비디오 데이터 */

export interface StartVideoSessionResponse {
  code: number;
  status: string;
  message: string;
  result: {
    session_id: string;
    watch_completed: boolean;
    video: {
      id: number;
      title: string;
      desc: string;
      watch_cnt: number;
      whole_time: number;
      created_at: string;
    };
    seg_view_cnts: number[];
    is_comment: boolean;
    is_scrapped: boolean;
    hashtags: string[];
    comments: {
      id: number;
      text: string;
      creator: string;
      created_at: string;
    }[];
    quizzes: {
      id: number;
      question: string;
      answer: boolean;
      member_answer: boolean;
      description: string;
    }[];
    created_at: string;
  };
}

// admin video
export interface AdminOrgVideoResponse {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: string;
  expired_at: string | null;
  open_scope: "PUBLIC" | "PRIVATE" | "GROUP";
  view_cnt: number;
}