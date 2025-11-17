import { useState } from "react";

interface HashtagSectionProps {
  onCategoryChange?: (category: string) => void;
}

const HashtagSection = ({ onCategoryChange }: HashtagSectionProps) => {
  const categories = [
    "전체",
    "정보보안",
    "직무교육",
    "장애인 교육",
    "신입교육",
    "AI 세미나",
    "기타",
  ];
  
  const [selected, setSelected] = useState("전체");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelected(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 py-2">
      {categories.map((category, index) => {
        const isSelected = selected === category;

        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              relative px-5 py-2 rounded-full text-sm font-semibold
              transform transition-all duration-200 ease-out
              ${
                isSelected
                  ? "bg-gradient-to-br from-primary to-primary-light text-white shadow-md scale-105"
                  : "bg-white text-text-primary border border-border-light shadow-sm hover:shadow-md hover:scale-105 hover:border-primary"
              }
            `}
          >
            {/* 3D 하이라이트 (선택된 버튼만) */}
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
            )}
            
            {/* 텍스트 */}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default HashtagSection;