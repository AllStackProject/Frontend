import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

/** -------------------------------------------------------
 * 카테고리 전체 조회  
 * GET /admin/org/{orgId}/group/{groupId}/category
 -------------------------------------------------------*/
export const getCategories = async (orgId: number, groupId: number) => {
  try {
    const res = await api.get(
      `/admin/org/${orgId}/group/${groupId}/category`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.categories; // [{ id, title }]
  } catch (err: any) {
    console.error("🚨 카테고리 조회 실패:", err);
    throw new Error(err.response?.data?.message || "카테고리 조회 실패");
  }
};

/** -------------------------------------------------------
 * 카테고리 추가  
 * POST /admin/org/{orgId}/group/{groupId}/category
 -------------------------------------------------------*/
export const addCategory = async (orgId: number, groupId: number, title: string) => {
  try {
    const res = await api.post(
      `/admin/org/${orgId}/group/${groupId}/category`,
      { title },
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err: any) {
    console.error("🚨 카테고리 추가 실패:", err);
    throw new Error(err.response?.data?.message || "카테고리 추가 실패");
  }
};

/** -------------------------------------------------------
 * 카테고리 수정  
 * PUT /admin/org/{orgId}/group/{groupId}/category/{categoryId}
 -------------------------------------------------------*/
export const updateCategory = async (
  orgId: number,
  groupId: number,
  categoryId: number,
  title: string
) => {
  try {
    const res = await api.put(
      `/admin/org/${orgId}/group/${groupId}/category/${categoryId}`,
      { title },
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err: any) {
    console.error("🚨 카테고리 수정 실패:", err);
    throw new Error(err.response?.data?.message || "카테고리 수정 실패");
  }
};

/** -------------------------------------------------------
 * 카테고리 삭제  
 * DELETE /admin/org/{orgId}/group/{groupId}/category/{categoryId}
 -------------------------------------------------------*/
export const deleteCategory = async (orgId: number, groupId: number, categoryId: number) => {
  try {
    const res = await api.delete(
      `/admin/org/${orgId}/group/${groupId}/category/${categoryId}`,
      { tokenType: "org" } as CustomAxiosRequestConfig
    );

    return res.data.result.is_success;
  } catch (err: any) {
    console.error("🚨 카테고리 삭제 실패:", err);
    throw new Error(err.response?.data?.message || "카테고리 삭제 실패");
  }
};