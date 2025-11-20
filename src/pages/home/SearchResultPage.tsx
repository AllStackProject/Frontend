import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrgMainLayout from "@/layouts/OrgMainLayout";
import SearchResultSection from "@/components/home/SearchResultSection";
import { useAuth } from "@/context/AuthContext";

const SearchResultPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const keyword = params.get("keyword") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      const { orgToken } = useAuth();
      if (!orgToken) navigate("/login/select", { replace: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <OrgMainLayout>
      <div className="px-8 py-6 w-full h-full">
        <SearchResultSection keyword={keyword} />
      </div>
    </OrgMainLayout>
  );
};

export default SearchResultPage;