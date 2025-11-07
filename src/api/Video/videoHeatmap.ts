import type { VideoHeatMapResponse, NormalizedSegment, VideoSegment } from "@/types/videoHeatmap";

/**
 * 비디오 Heat Map 데이터를 가져오는 API 함수
 * TODO: 실제 API 엔드포인트로 교체 필요
 * 
 * @param videoId - 비디오 ID
 * @returns 구간별 재생 횟수 배열 [12, 23, 56, 48, ...]
 */
export const fetchVideoHeatMap = async (
  videoId: number
): Promise<VideoHeatMapResponse> => {
  // TODO: 실제 API 호출로 교체
  // const response = await fetch(`/api/videos/${videoId}/heatmap`);
  // return response.json();

  // Mock 데이터 (개발용) - 단순 배열 형식
  return new Promise((resolve) => {
    setTimeout(() => {
      // 30개 구간 (0~9초, 10~19초, ..., 290~299초)
      const mockData = Array.from({ length: 100 }, (_, i) => 
        Math.floor(
          Math.random() * 1000 + 
          (i > 5 && i < 15 ? 1500 : 500) // 중간 구간이 더 많이 재생됨
        )
      );

      resolve(mockData);
    }, 500); // 네트워크 지연 시뮬레이션
  });
};

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