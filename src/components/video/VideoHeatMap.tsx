import React, { useEffect, useRef } from "react";
import type { NormalizedSegment } from "@/types/videoHeatmap";

interface VideoHeatMapProps {
  /** 정규화된 구간 데이터 */
  segments: NormalizedSegment[];
  /** 비디오 전체 길이 (초) */
  duration: number;
  /** Heat Map 높이 (px) */
  height?: number;
  /** 그래프 색상 */
  color?: string;
  /** 투명도 (0~1) */
  opacity?: number;
}

const VideoHeatMap: React.FC<VideoHeatMapProps> = ({
  segments,
  duration,
  height = 40,
  color = "#3674B5",
  opacity = 0.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || segments.length === 0 || duration === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 캔버스 초기화
    ctx.clearRect(0, 0, rect.width, height);

    // 그래프 그리기
    drawHeatMap(ctx, segments, duration, rect.width, height, color, opacity);
  }, [segments, duration, height, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: `${height}px` }}
    />
  );
};

/**
 * Canvas에 Heat Map 그래프를 그리는 함수
 */
const drawHeatMap = (
  ctx: CanvasRenderingContext2D,
  segments: NormalizedSegment[],
  duration: number,
  width: number,
  height: number,
  color: string,
  opacity: number
) => {
  if (segments.length === 0) return;

  // 부드러운 곡선을 위한 포인트 계산
  const points: { x: number; y: number }[] = [];

  segments.forEach((segment) => {
    const x = (segment.start / duration) * width;
    const y = height - segment.normalizedValue * height;
    points.push({ x, y });
  });

  // 마지막 포인트 추가
  const lastSegment = segments[segments.length - 1];
  points.push({
    x: (lastSegment.end / duration) * width,
    y: height - lastSegment.normalizedValue * height,
  });

  // 그라디언트 생성 (아래에서 위로 투명도 감소)
  const gradient = ctx.createLinearGradient(0, height, 0, 0);
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 59, g: 130, b: 246 }; // 기본값 blue-500
  };

  const rgb = hexToRgb(color);
  gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.2})`);
  gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`);
  gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);

  // 영역 채우기 (그라디언트)
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, height);

  // Cubic Bezier 곡선으로 부드럽게 연결
  if (points.length > 0) {
    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // 제어점 계산 (부드러운 곡선)
      const controlX = (current.x + next.x) / 2;

      ctx.bezierCurveTo(
        controlX,
        current.y,
        controlX,
        next.y,
        next.x,
        next.y
      );
    }
  }

  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // 상단 라인 그리기 (더 진한 색상)
  ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 1.2})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  if (points.length > 0) {
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;

      ctx.bezierCurveTo(
        controlX,
        current.y,
        controlX,
        next.y,
        next.x,
        next.y
      );
    }
  }

  ctx.stroke();
};

export default VideoHeatMap;