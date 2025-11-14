import api from "@/api/axiosInstance";
import type { CustomAxiosRequestConfig } from "@/api/axiosInstance";

// 1) 그룹 추가
export const addGroup = async (orgId: number, name: string) => {
  const res = await api.post(
    `/admin/org/${orgId}/group`,
    { name },
    { tokenType: "org" } as CustomAxiosRequestConfig
  );
  return res.data.result;
};

// 2) 그룹 삭제
export const deleteGroupApi = async (orgId: number, groupId: number) => {
  const res = await api.delete(
    `/admin/org/${orgId}/group/${groupId}`,
    { tokenType: "org" } as CustomAxiosRequestConfig
  );
  return res.data.result;
};

// 3) 그룹 이름 수정
export const updateGroup = async (orgId: number, groupId: number, newName: string) => {
  const res = await api.put(
    `/admin/org/${orgId}/group/${groupId}`,
    { name: newName },
    { tokenType: "org" } as CustomAxiosRequestConfig
  );
  return res.data.result;
};