import { useEffect, useState } from "react";
import { fetchOrgMyActivityGroup } from "@/api/myactivity/info";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CategorySection = ({ onCategoryChange }: { onCategoryChange?: (c: string) => void }) => {
  const { orgId } = useAuth();

  const [categories, setCategories] = useState<string[]>(["전체"]);
  const [selected, setSelected] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const MAX_VISIBLE = 9;

  /** API 로딩 */
  useEffect(() => {
    const load = async () => {
      if (!orgId) return;

      try {
        const res = await fetchOrgMyActivityGroup(orgId);

        const merged = Array.from(
          new Set(
            res.member_groups.flatMap((g) =>
              g.categories?.map((c) => c.title) ?? []
            )
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

  const hiddenCount =
    categories.length > MAX_VISIBLE ? categories.length - MAX_VISIBLE : 0;

  const displayCategories = showAll
    ? categories
    : categories.slice(0, MAX_VISIBLE);

  const handleCategoryClick = (cat: string) => {
    setSelected(cat);
    onCategoryChange?.(cat);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4 text-gray-500">
        카테고리를 불러오는 중...
      </div>
    );
  }

  return (
      <div className="flex flex-wrap justify-center items-center gap-3">

        {/* 카테고리 버튼 */}
        {displayCategories.map((category) => {
          const isSelected = selected === category;
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`
                rounded-full px-4 py-2 text-sm font-semibold transition
                ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-primary"
                }
              `}
            >
              {category}
            </button>
          );
        })}
        {/* 더보기 버튼 */}
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="
              flex items-center gap-1 rounded-full px-3 py-1 text-xs
              text-gray-500 bg-gray-100 border border-gray-300 hover:border-primary transition
            "
          >
            {showAll ? (
              <>
                접기
                <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
              </>
            ) : (
              <>
                더보기
                <ChevronDown className="h-4 w-4 transition-transform" />
              </>
            )}
          </button>
        )}
      </div>
  );
};

export default CategorySection;