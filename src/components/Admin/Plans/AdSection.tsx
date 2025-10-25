import React, { useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

const AdSection: React.FC = () => {
  // 현재 등록된 배너
  const [currentBanner, setCurrentBanner] = useState<string>(
    "/dummy/AD2.png"
  );

  // 새로 업로드할 배너 (미리보기 용)
  const [newBanner, setNewBanner] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setNewBanner(preview);
    }
  };

  const handleSaveNewBanner = () => {
    if (newBanner) {
      setCurrentBanner(newBanner);
      setNewBanner(null);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setNewBanner(null);
    setIsEditing(false);
  };

  const handleDeleteBanner = () => {
    if (window.confirm("현재 배너 이미지를 삭제하시겠습니까?")) {
      setCurrentBanner("");
      setNewBanner(null);
    }
  };

  return (
    <div>
      {/* 현재 배너 */}
      {currentBanner && !isEditing ? (
        <div className="border rounded-lg p-6 bg-gray-50 text-center">
          <div className="relative inline-block">
            <img
              src={currentBanner}
              alt="현재 배너"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleDeleteBanner}
                className="bg-white/80 rounded-full p-2 hover:bg-white shadow"
                title="배너 삭제"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ※ 이 배너는 조직 홈 화면 상단에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-gray-50 text-center">
          {!newBanner ? (
            <label className="cursor-pointer inline-flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white p-8 rounded-lg hover:border-blue-400 transition w-full max-w-2xl">
              <ImagePlus size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                새 배너 이미지를 업로드하려면 클릭하세요
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="relative inline-block">
              <img
                src={newBanner}
                alt="새 배너 미리보기"
                className="w-full max-w-2xl h-48 object-cover rounded-lg border"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleSaveNewBanner}
                  className="bg-white/80 rounded-full p-2 hover:bg-white shadow"
                  title="저장"
                >
                  <Upload size={16} className="text-green-500" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-white/80 rounded-full p-2 hover:bg-white shadow"
                  title="취소"
                >
                  <Trash2 size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdSection;