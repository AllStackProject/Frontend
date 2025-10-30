import React from "react";
import { Eye, Calendar, Hash } from "lucide-react";

interface VideoInfoProps {
  title: string;
  channel: string;
  views: number;
  uploadDate: string;
  categories?: string[];
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  views,
  uploadDate,
  categories = [],
}) => {
  return (
    <div className="bg-bg-card border border-border-light rounded-xl shadow-base p-6">
      {/* 제목 */}
      <h1 className="text-xl font-bold text-text-primary mb-3 leading-snug">
        {title}
      </h1>

      {/* 해시태그 */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full text-primary border border-border-light"
            >
              <Hash size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 메타데이터 */}
      <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <Eye size={16} className="text-text-muted" />
          <span>{views.toLocaleString()}회 시청</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={16} className="text-text-muted" />
          <span>{uploadDate}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;