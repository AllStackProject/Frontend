import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { StartVideoSessionResponse, UploadVideoRequest, UploadVideoResponse } from "@/types/video";
import axios from "axios";

/**
 * 영상 시청 세션 시작 (조직별 org_token 인증)
 * @param orgId 조직 ID
 * @param videoId 비디오 ID
 */
export const startVideoSession = async (
    orgId: number,
    videoId: number
): Promise<StartVideoSessionResponse["result"]> => {
    try {
        const orgToken = localStorage.getItem("org_token");
        const storedOrgId = localStorage.getItem("org_id");

        if (!orgToken || !storedOrgId) {
            throw new Error("조직 정보가 유효하지 않습니다. 다시 선택해주세요.");
        }

        if (Number(storedOrgId) !== orgId) {
            console.warn("⚠️ 전달된 orgId와 현재 저장된 org_id가 일치하지 않습니다.");
        }

        const response = await api.post(
            `/${orgId}/video/${videoId}/join`,
            
            {},
            {
                tokenType: "org",
            } as CustomAxiosRequestConfig
        );
        
        return response.data.result;
    } catch (error: any) {
        console.error("🚨 영상 세션 시작 중 오류:", error);
        const message =
            error.response?.data?.message ||
            "영상 시청 세션을 시작하는 중 오류가 발생했습니다.";
        throw new Error(message);
    }
};

/** 비디오 시청 종료 API */
export const leaveVideoSession = async (
  orgId: number,
  videoId: number,
  payload: {
    session_id: string;
    watch_rate: number;
    watch_segments: string;
    recent_position: number;
    is_quit: boolean;
  }
) => {
  try {
    const response = await api.post(
      `/${orgId}/video/${videoId}/leave`,
      payload,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (err: any) {
    console.error("🚨 LEAVE API 실패", err);
  }
};

/* 영상 업로드 */
/**
 * Step 1. 영상 메타데이터 + 썸네일 업로드 → presigned URL 받기
 */
export const requestVideoUpload = async (
  orgId: number,
  payload: {
    title: string;
    description: string;
    whole_time: number;
    is_comment: boolean;
    ai_function: string;
    expired_at: string | null;
    thumbnail_img: File;
  }
): Promise<{ presigned_url: string, video_id: number }> => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("whole_time", String(payload.whole_time));
    formData.append("is_comment", String(payload.is_comment));
    formData.append("ai_function", payload.ai_function);

    if (payload.expired_at) {
      formData.append("expired_at", payload.expired_at);
    }

    formData.append("thumbnail_img", payload.thumbnail_img);

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/${orgId}/video`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("org_token")}`,
        },
      }
    );

    return res.data.result;
  } catch (err: any) {
    console.error("❌ requestVideoUpload error:", err);
    throw new Error(err.response?.data?.message || "영상 정보 업로드 실패");
  }
};

/**
 * Step 2. presigned URL로 영상 PUT 업로드
 */
export const uploadVideoToS3 = async (presignedUrl: string, file: File) => {
  try {
    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "video/mp4",
      },
    });

    if (!res.ok) throw new Error("S3 업로드 실패");

    return true;
  } catch (error) {
    console.error("❌ S3 업로드 실패:", error);
    throw error;
  }
};

/** Step 3. 업로드 성공 여부 서버 전달 */
export const notifyUploadStatus = async (
  orgId: number,
  videoId: number,
  isSuccess: boolean
) => {
  try {
    const response = await api.put(
      `/${orgId}/video/${videoId}`,
      {},
      {
        params: { is_success: isSuccess },
        tokenType: "org",
      } as CustomAxiosRequestConfig
    );

    return response.data.result;
  } catch (err: any) {
    console.error("🚨 업로드 성공 여부 전달 실패", err);
    throw new Error(err.response?.data?.message || "업로드 여부 전달 실패");
  }
};