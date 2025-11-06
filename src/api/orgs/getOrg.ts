import axiosInstance from "@/api/axiosInstance";
import type { OrganizationResponse } from "@/types/org";

export const getOrganizations = async (): Promise<OrganizationResponse[]> => {
  try {
    const res = await axiosInstance.get("/orgs");

    return res.data.result.organizations || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "조직 목록을 불러오지 못했습니다.");
  }
};