/**
 * 영상 시청 기록 타입
 */
export interface WatchedVideo {
  id: number;
  name: string;
  img: string;
  watch_rate: number;
  recent_watch: string; // ISO date string
}