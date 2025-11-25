import type { NormalizedSegment, VideoSegment } from "@/types/videoHeatmap";

/**
 * 서버에서 받은 배열 데이터를 VideoSegment 형식으로 변환
 * 
 * @param viewCounts - 재생 횟수 배열 [12, 23, 56, ...]
 * @param segmentDuration - 각 구간의 길이 (초, 기본값: 10초)
 * @returns VideoSegment 배열
 */
export const convertToSegments = (
  viewCounts: number[],
  segmentDuration: number = 10
): VideoSegment[] => {
  return viewCounts.map((viewCount, index) => ({
    start: index * segmentDuration,
    end: (index + 1) * segmentDuration,
    viewCount,
  }));
};

/**
 * Heat Map 데이터를 정규화 (0~1 사이 값으로 변환)
 * 
 * @param segments - VideoSegment 배열
 * @returns 정규화된 NormalizedSegment 배열
 */
export const normalizeHeatMapData = (
  segments: VideoSegment[]
): NormalizedSegment[] => {
  const maxViewCount = Math.max(...segments.map((s) => s.viewCount));
  
  return segments.map((segment) => ({
    ...segment,
    normalizedValue: maxViewCount > 0 ? segment.viewCount / maxViewCount : 0,
  }));
};