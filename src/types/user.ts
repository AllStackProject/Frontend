export interface UserInfoResponse {
  id: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  ages: number;
  phone_number: string;
  organizations: string[];
}

export interface UpdateUserInfoRequest {
  newPassword?: string;
  confirmPassword?: string;
  changed_age?: string;
  changed_gender?: string;
  changed_phone_num?: string;
}