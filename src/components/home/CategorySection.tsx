import { useEffect, useState } from "react";
import { fetchOrgMyActivityGroup } from "@/api/myactivity/info";
import { useAuth } from "@/context/AuthContext";

const CategorySection = ({ onCategoryChange }: { onCategoryChange?: (c: string) => void }) => {
  const { orgId } = useAuth();

  const [categories, setCategories] = useState<string[]>(["전체"]);
  const [selected, setSelected] = useState("전체");
  const [loading, setLoading] = useState(true);

  /** API 로 카테고리 로딩 */
  useEffect(() => {
    const load = async () => {
      if (!orgId) return;

      try {
        const res = await fetchOrgMyActivityGroup(orgId);

        /** member_groups → categories → title 추출 */
        const merged = Array.from(
          new Set(
            res.member_groups
              .flatMap((group) =>
                group.categories?.map((c) => c.title) ?? []
              )
              .filter((c): c is string => typeof c === "string")
          )
        );

        setCategories(["전체", ...merged]);
      } catch (err) {
        console.error("❌ 카테고리 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orgId]);

  const handleCategoryClick = (category: string) => {
    setSelected(category);
    onCategoryChange?.(category);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4 text-gray-500">
        카테고리를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 py-2">
      {categories.map((category) => {
        const isSelected = selected === category;

        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`
              relative px-5 py-2 rounded-full text-sm font-semibold
              transform transition-all duration-200 ease-out
              ${
                isSelected
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white text-text-primary border border-border-light shadow-sm hover:shadow-md hover:scale-105 hover:border-primary"
              }
            `}
          >
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategorySection;