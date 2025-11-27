import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";
import type { StartVideoSessionResponse } from "@/types/video";
import type { VideoMetaData } from "@/types/video";
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
    member_id: number,
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
    member_groups: number[];
    categories: number[];
    thumbnail_img: File; 
  }
): Promise<{ presigned_url: string; video_id: number }> => {
  try {
    const query = new URLSearchParams({
      title: payload.title,
      description: payload.description,
      whole_time: String(payload.whole_time),
      is_comment: String(payload.is_comment),
      ai_function: payload.ai_function,
      member_groups: payload.member_groups.join(","), 
      categories: payload.categories.join(","),
    });

    if (payload.expired_at) {
      query.append("expired_at", payload.expired_at);
    }

    const formData = new FormData();
    formData.append("thumbnail_img", payload.thumbnail_img);

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/${orgId}/video?${query.toString()}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("org_token")}`
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
      // headers: {
      //   "Content-Type": "video/mp4",
      // },
    });

    if (!res.ok) throw new Error("S3 업로드 실패");

    return true;
  } catch (error) {
    console.error("❌ S3 업로드 실패:", error);
    throw error;
  }
};

/**
 * Step 3. 업로드 처리 성공 여부 조회 (GET /{orgId}/video/{videoId}/success)
 */
export const checkUploadStatus = async (
  orgId: number, 
  videoId: number
): Promise<"IN_PROGRESS"|"COMPLETE"|"FAIL"> => {
  try {
    const response = await api.get(
      `/${orgId}/video/${videoId}/success`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    const status = response.data?.result?.upload_status;

    if (status === "COMPLETE")
      return "COMPLETE";
    else if (status === "IN_PROGRESS") 
      return "IN_PROGRESS";
    return "FAIL"; // 기본값

  } catch (err: any) {
    console.error("❌ 업로드 상태 확인 실패:", err);
    return "IN_PROGRESS"; // 일시적 실패는 계속 폴링
  }
};

/* 영상 메타데이터 조회 */
export const getVideoData = async (
  orgId: number,
  videoId: number
): Promise<VideoMetaData | null> => {
  try {
    const response = await api.get(
      `/${orgId}/video/${videoId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    const data = response.data?.result;
    if (!data) return null;

    // thumbnail_url 정규화
    const normalizedThumbnail =
      data.thumbnail_url?.startsWith("http")
        ? data.thumbnail_url
        : `https://${data.thumbnail_url}`;

    const mapped: VideoMetaData = {
      ...data,
      thumbnail_url: normalizedThumbnail,
    };

    return mapped;

  } catch (err) {
    console.error("❌ 영상 메타데이터 확인 실패:", err);
    return null;
  }
};