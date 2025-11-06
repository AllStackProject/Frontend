export interface UserInfoResponse {
  id: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  ages: number;
  phone_number: string;
  organizations: string[];
}