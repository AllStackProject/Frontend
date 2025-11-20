/**
 * 비디오 구간별 재생 횟수 데이터
 */
export interface VideoSegment {
  /** 구간 시작 시간 (초) */
  start: number;
  /** 구간 종료 시간 (초) */
  end: number;
  /** 해당 구간의 재생 횟수 */
  viewCount: number;
}

/**
 * 서버에서 받아올 Heat Map 데이터 응답
 * 배열 형식: [12, 23, 56, 48, 56, ...]
 * - 첫 번째 값: 0~9초 구간의 재생 횟수
 * - 두 번째 값: 10~19초 구간의 재생 횟수
 * - 세 번째 값: 20~29초 구간의 재생 횟수
 * - ...
 */
export type VideoHeatMapResponse = number[];

/**
 * 정규화된 Heat Map 데이터 (프론트엔드 내부용)
 */
export interface NormalizedSegment {
  /** 구간 시작 시간 (초) */
  start: number;
  /** 구간 종료 시간 (초) */
  end: number;
  /** 원본 재생 횟수 */
  viewCount: number;
  /** 정규화된 값 (0~1) */
  normalizedValue: number;
}