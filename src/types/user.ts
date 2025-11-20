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
  new_password?: string;
  confirm_password?: string;
  changed_age?: number;
  changed_gender?: string;
  changed_phone_num?: string;
}

export interface UpdateUserInfoResponse {
  code: number;
  status: string;
  message: string;
  result: {
    is_success: boolean;
  };
}