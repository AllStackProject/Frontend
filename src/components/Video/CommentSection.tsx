import React from "react";

interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  const getRandomAvatar = (userId: number) => {
    const avatarNumber = (userId % 9) + 1; // 1~9 순환
    return `/user${avatarNumber}.png`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      {/* 헤더 */}
      <div className="flex flex-col mb-5">
        <div className="flex items-center gap-2">
          <img
            src="/comment-icon.png"
            alt="댓글"
            className="w-[100px] object-contain translate-y-[1px]"
          />
        </div>
        <div className="border-b border-gray-200 mt-3"></div>
      </div>

      {/* 댓글 리스트 */}
      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <img
                src={comment.avatar || getRandomAvatar(comment.id)}
                alt={comment.user}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

            {/* 내용 */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1 mb-1">
                <span className="font-semibold text-gray-900 text-sm">
                  {comment.user}
                </span>
                <span className="text-xs text-gray-400">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;