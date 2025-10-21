import React, { useState } from "react";

interface NotificationSetting {
  id: string;
  label: string;
  enabled: boolean;
}

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: "group_videos", label: "내가 속한 조직의 최신 동영상", enabled: true },
    { id: "group_noti_videos", label: "내가 속한 조직의 공지 영상", enabled: false },
    { id: "my_comment_replies", label: "내가 작성한 댓글의 답글", enabled: true },
    { id: "recommended_video", label: "AI 추천 동영상", enabled: true },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-base border border-border-light p-6 space-y-6">
      <h2 className="text-xl font-semibold text-text-primary">시스템 알림</h2>

      <div className="divide-y divide-border-light">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between py-4 hover:bg-gray-50 transition-colors px-2 rounded-lg"
          >
            {/* 알림 제목 */}
            <span className="text-text-secondary font-medium">
              {setting.label}
            </span>

            {/* 토글 스위치 */}
            <button
              onClick={() => toggleSetting(setting.id)}
              className={`relative w-12 h-6 flex items-center rounded-full transition-all duration-300 ${
                setting.enabled ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  setting.enabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>
        ))}
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end pt-4">
        <button className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-light transition">
          변경사항 저장
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;