import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  requestVideoUpload,
  uploadVideoToS3,
  checkUploadStatus,
} from "@/api/video/video";
import { useModal } from "@/context/ModalContext";

type UploadStatus = "IDLE" | "IN_PROGRESS" | "COMPLETE" | "FAIL";

interface StartUploadPayload {
  title: string;
  description: string;
  whole_time: number;          // 초 단위
  is_comment: boolean;
  ai_function: string;         // "NONE" | "QUIZ" | ...
  expired_at: string | null;   // yyyy-MM-dd or null
  thumbnail_img: File;
  video_file: File;
}

interface StartUploadParams {
  orgId: number;
  payload: StartUploadPayload;
  /** 업로드 + 서버 처리까지 성공했을 때 (리스트 리프레시 등) */
  onSuccess?: () => void;
  /** S3 업로드 실패 or 서버 처리 실패 or 타임아웃 등 */
  onFailure?: (error: any) => void;
}

interface UploadContextValue {
  isUploading: boolean;
  status: UploadStatus;
  uploadTitle: string | null;
  uploadStartTime: string | null;
  videoId: number | null;
  /** 업로드 전체 플로우 시작 (모달에서 호출) */
  startUpload: (params: StartUploadParams) => void;
}

const UploadContext = createContext<UploadContextValue | undefined>(undefined);

export const useUpload = () => {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return ctx;
};

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const { openModal } = useModal();

  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("IDLE");
  const [uploadTitle, setUploadTitle] = useState<string | null>(null);
  const [uploadStartTime, setUploadStartTime] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number | null>(null);

  /** 서버에 업로드 상태 폴링 (모달 닫혀도 계속 돈다) */
  const pollUploadStatus = useCallback(
    async (orgId: number, vId: number, onSuccess?: () => void) => {
      const MAX_TIME = 30 * 60 * 1000; // 30분
      const INTERVAL = 8000; // 8초
      const start = Date.now();

      while (Date.now() - start < MAX_TIME) {
        let serverStatus: string;

        try {
          serverStatus = await checkUploadStatus(orgId, vId);
          // 서버 응답 예시: "IN_PROGRESS" | "COMPLETE" | "FAIL" 등
        } catch (err) {
          console.error("❌ 업로드 상태 조회 실패:", err);
          await new Promise((res) => setTimeout(res, INTERVAL));
          continue;
        }

        if (serverStatus === "COMPLETE") {
          setStatus("COMPLETE");

          onSuccess?.();
          return;
        }

        if (serverStatus === "FAIL") {
          setStatus("FAIL");

          return;
        }

        // IN_PROGRESS 등 → 계속 대기
        await new Promise((res) => setTimeout(res, INTERVAL));
      }

      // 30분 타임아웃
      setStatus("FAIL");
      setIsUploading(false);

      openModal({
        type: "error",
        title: "업로드 지연",
        message: "서버가 업로드 완료 신호를 보내지 않았습니다.",
      });
    },
    [openModal]
  );

  /** 업로드 전체 플로우 시작 */
  const startUpload = useCallback(
    ({
      orgId,
      payload,
      onSuccess,
      onFailure,
    }: StartUploadParams): void => {
      // 비동기 작업은 내부에서 즉시 실행 (호출측은 fire-and-forget)
      (async () => {
        try {
          setIsUploading(true);
          setStatus("IN_PROGRESS");
          setUploadTitle(payload.title);

          const now = new Date();
          const timeStr = now.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setUploadStartTime(timeStr);

          // 1) 메타데이터 업로드 → presigned URL + video_id
          const { presigned_url, video_id } = await requestVideoUpload(orgId, {
            title: payload.title,
            description: payload.description,
            whole_time: payload.whole_time,
            is_comment: payload.is_comment,
            ai_function: payload.ai_function,
            expired_at: payload.expired_at,
            thumbnail_img: payload.thumbnail_img,
          });

          setVideoId(video_id);

          // 2) presigned URL로 S3 업로드
          await uploadVideoToS3(presigned_url, payload.video_file);

          // 3) 서버 업로드 상태 폴링 시작
          await pollUploadStatus(orgId, video_id, onSuccess);
        } catch (err: any) {
          console.error("❌ 업로드 전체 플로우 실패:", err);
          setStatus("FAIL");
          setIsUploading(false);

          openModal({
            type: "error",
            title: "업로드 실패",
            message: err?.message || "업로드 중 오류가 발생했습니다.",
          });

          onFailure?.(err);
        }
      })();
    },
    [openModal, pollUploadStatus]
  );

  const value: UploadContextValue = {
    isUploading,
    status,
    uploadTitle,
    uploadStartTime,
    videoId,
    startUpload,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};