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


/* admin */

export interface AdminVideoWatchItem {
  id: number;
  title: string;
  creator: string;
  expired_at: string;
  open_scope: "PUBLIC" | "PRIVATE" | "GROUP";
  watch_complete_rate: number;
  watch_member_cnt: number;
}

export interface AdminOrgVideoWatchResponse {
  code: number;
  status: string;
  message: string;
  result: {
    all_video_watch: AdminVideoWatchItem[];
  };
}

// ----------- 개별 영상 상세 조회 -----------

export interface AdminWatchedMember {
  nickname: string;
  groups: string[];
  watch_rate: number;
  watched_at: string | null;
}

export interface AdminOrgSingleVideoWatchResponse {
  code: number;
  status: string;
  message: string;
  result: {
    watched_members: AdminWatchedMember[];
  };
}

// ----------- 멤버별 영상 시청 조회 -----------

// 전체 멤버 시청 요약
export interface MemberWatchSummary {
  id: number;
  nickname: string;
  groups: string[];
  avg_watch_rate: number;
}

// 특정 멤버 상세 시청 기록
export interface MemberWatchDetail {
  id: number;
  title: string;
  watch_rate: number;
  watched_at: string;
}
// 특정 멤버 영상 리포트
export interface MemberReportResponse {
    total_watched_video_cnt: number;
    most_watched_categories: string[];
    monthly_watched_cnts: {
        year: number;
        month: number;
        watched_video_cnt: number;
    }[];
}

// ----------- 리포트 - 활동 분석 -----------
export interface HourWatchReport {
    hour_watch_cnts: number[]; // 00-03 03-06 06-09 ...
}

export interface DayWatchReport {
    day_watch_cnts: number[]; // 길이 7 예상 (월~일)
}

// ----------- 리포트 - 사용자 분석 -----------
export interface HourWatchReport {
  hour_watch_cnts: number[];
}

export interface GroupWatchRate {
  avg_complete_rate: number;
  group_watch_complete_rates: {
    name: string;
    avg_group_complete_rate: number;
  }[];
}
