import { createContext, useContext, useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const LoadingContext = createContext({
  loading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const LoadingProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => 

  /** Axios에서 보낸 이벤트 감지 */
  useEffect(() => {
    const onStart = () => showLoading();
    const onEnd = () => hideLoading();

    window.addEventListener("loading-start", onStart);
    window.addEventListener("loading-end", onEnd);

    return () => {
      window.removeEventListener("loading-start", onStart);
      window.removeEventListener("loading-end", onEnd);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <LoadingSpinner text="로딩 중.." />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);