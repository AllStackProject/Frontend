import React from "react";
import { useNavigate } from "react-router-dom";

interface VideoInfoProps {
  title: string;
  channel: string;
  views: number;
  uploadDate: string;
  category: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  channel,
  views,
  uploadDate,
  category,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      {/* 메타데이터 */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
        {/* 조직명 */}
        <button
          onClick={() => navigate("/home")}
          className="text-gray-700 font-medium hover:text-[#3674B5] transition-colors cursor-pointer"
        >
          {channel}
        </button>

        <span className="text-gray-300">|</span>

        {/* 날짜 */}
        <span className="text-gray-500">{uploadDate}</span>

        <span className="text-gray-300">|</span>

        {/* 카테고리 (해시태그) */}
        <button
          onClick={() => navigate("/home")}
          className="text-[#3674B5] hover:underline cursor-pointer"
        >
          #{category}
        </button>

        <span className="text-gray-300">|</span>

        {/* 조회수 */}
        <span className="text-gray-500">
          조회수 {views.toLocaleString()}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
        {title}
      </h1>
    </div>
  );
};

export default VideoInfo;