// 회원가입
/** 회원가입 단계별 입력값 전체 구조 */
export interface RegisterValues {
  name: string;
  gender: "남성" | "여성" | "";
  age: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
  organizationCode: string;
  ageGroup: "" | "over14" | "under14";
  agreeAll: boolean;
  agreeTos: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

/** 에러 및 터치 상태를 위한 제네릭 Record 타입 */
export type FormErrors = Partial<Record<keyof RegisterValues, string>>;
export type FormTouched = Partial<Record<keyof RegisterValues, boolean>>;

/** API 요청용 회원가입 DTO */
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  gender: "MALE" | "FEMALE";
  age: number;
  phone_number: string;
  organization_code?: string;
}

/** API 응답 타입 */
export interface SignupResponse {
  code: number;
  status: string;
  message: string;
  result?: any;  // 필요시 구체적인 타입 정의
}

// 로그인
/** 로그인 요청 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 로그인 응답 */
export interface LoginResponse {
  is_success: boolean;
}