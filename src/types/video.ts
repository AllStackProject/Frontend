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
  created_at: string,
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

// ----------- 리포트 - 멤버 분석 -----------
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

// ----------- 내활동 - 내가 올린 동영상 목록 -----------
export interface MyVideoItem {
  id: number;
  title: string;
  thumbnail_url: string;
  created_at: string;
  expired_at: string | null;
  open_scope: "PUBLIC" | "GROUP" ;
  view_cnt: number;
}

// ----------- 영상 업로드 -----------
export interface UploadVideoRequest {
  title: string;
  description: string;
  thumbnailFile: File;        // 썸네일 PNG
  whole_time: number;         // 영상 전체 길이(초)
  is_comment: boolean;
  ai_function: "NONE" | "QUIZ" | "FEEDBACK" | "SUMMARY";
  expired_at?: string | null; // null 가능
}

export interface UploadVideoResponse {
  presigned_url: string;
}


/* 영상 메타데이터 조회 */
export interface VideoMetaData {
  title: string;
  description: string;
  thumbnail_url: string;
  watch_cnt: number;
  expired_at: string | null;
  is_comment: boolean;
  open_scope: "PUBLIC" | "GROUP";
  member_groups: {
    id: number;
    name: string;
    categories: {
      id: number;
      title: string;
      is_selected: boolean;
    }[];
    is_selected: boolean;
  }[];
}