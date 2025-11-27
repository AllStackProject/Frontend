import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '@/components/signup/StepIndicator';
import AgeGroupSelect from '@/components/signup/AgeGroupSelect';
import TermsAgreement from '@/components/signup/TermsAgreement';
import RegisterForm from '@/components/signup/RegisterForm';
import RegisterComplete from '@/components/signup/RegisterComplete';
import { useModal } from "@/context/ModalContext";
import { signup } from "@/api/user/signup";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const phoneRe = /^[0-9]{10,11}$/;
const nameRe = /^[가-힣]{2,5}$/;

// 비밀번호 정책: 영문, 숫자, 특수문자 중 2종류 이상 조합 + 8자 이상
const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  return typeCount >= 2;
};

const steps = ['약관동의', '정보입력', '가입완료'];

export default function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    gender: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
    organizationCode: '',
    ageGroup: '' as '' | 'over14' | 'under14',
    agreeAll: false,
    agreeTos: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { openModal } = useModal();

  const validate = () => {
    const e: Record<string, string> = {};

    if (step === 1) {
      // 연령대 필수 선택
      if (!values.ageGroup) {
        e.ageGroup = '연령대를 선택해 주세요.';
      }
      // 필수 약관 동의 체크
      if (!values.agreeTos) {
        e.agreeTos = '이용약관 동의가 필요합니다.';
      }
      if (!values.agreePrivacy) {
        e.agreePrivacy = '개인정보 수집 동의가 필요합니다.';
      }
    } else if (step === 2) {
      // Step 2 진입 전 연령대 재확인 (보안 강화)
      if (!values.ageGroup) {
        e.ageGroup = '연령대를 선택해 주세요.';
      }

      // 이름 (필수)
      if (!values.name.trim()) {
        e.name = '이름을 입력해 주세요.';
      } else if (!nameRe.test(values.name)) {
        e.name = '이름은 한글 2~5글자로 입력해 주세요.';
      }

      // 성별 (필수)
      if (!values.gender) {
        e.gender = '성별을 선택해 주세요.';
      }

      // 나이대 (필수)
      if (!values.age) {
        e.age = '나이대를 선택해 주세요.';
      }

      // 전화번호 (필수)
      if (!values.phone) {
        e.phone = '전화번호를 입력해 주세요.';
      } else if (!phoneRe.test(values.phone)) {
        e.phone = '전화번호는 10~11자리 숫자로 입력해 주세요.';
      }

      // 이메일 (필수)
      if (!values.email) {
        e.email = '이메일을 입력해 주세요.';
      } else if (!emailRe.test(values.email)) {
        e.email = '올바른 이메일 형식으로 입력해 주세요.';
      }

      // 비밀번호 (필수 + 정책)
      if (!values.password) {
        e.password = '비밀번호를 입력해 주세요.';
      } else if (!validatePassword(values.password)) {
        e.password = '영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8자 이상 입력해 주세요.';
      }

      // 비밀번호 확인 (필수)
      if (!values.confirm) {
        e.confirm = '비밀번호 확인을 입력해 주세요.';
      } else if (values.confirm !== values.password) {
        e.confirm = '비밀번호가 일치하지 않아요.';
      }

      // 조직코드는 선택사항이므로 검증 제외
    }

    return e;
  };

  const handleChange = (key: keyof typeof values, value: any) => {
    // 전화번호 입력 제한: 숫자만 + 최대 11자리
    if (key === "phone") {
      value = value.replace(/[^0-9]/g, ""); // 숫자만
      value = value.slice(0, 11);           // 11자리 제한
    }

    const next = { ...values, [key]: value };

    // 전체 동의 로직
    if (key === 'agreeAll') {
      next.agreeTos = next.agreePrivacy = next.agreeMarketing = !!value;
    }

    // 개별 약관 체크 시 전체 동의 업데이트
    if (['agreeTos', 'agreePrivacy', 'agreeMarketing'].includes(key)) {
      next.agreeAll = next.agreeTos && next.agreePrivacy && next.agreeMarketing;
    }

    setValues(next);

    // 입력 중 실시간 에러 제거
    if (touched[key]) {
      const newErrors = validate();
      setErrors(newErrors);
    }
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const newErrors = validate();
    setErrors(newErrors);
  };

  const nextStep = () => {
    const errs = validate();
    setErrors(errs);

    const touchFields: Record<string, boolean> = step === 1
      ? { ageGroup: true, agreeTos: true, agreePrivacy: true }
      : {
        name: true,
        gender: true,
        age: true,
        phone: true,
        email: true,
        password: true,
        confirm: true
      };

    setTouched((prev) => ({ ...prev, ...touchFields }));

    if (Object.keys(errs).length > 0) {
      // 에러가 있을 경우 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errs)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (Object.keys(errs).length > 0) {
      const firstErrorField = Object.keys(errs)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      let genderValue: "MALE" | "FEMALE";

      if (values.gender === "남성") genderValue = "MALE";
      else if (values.gender === "여성") genderValue = "FEMALE";
      else {
        openModal({
          type: "error",
          title: "오류 발생",
          message: "성별을 올바르게 선택해 주세요.",
        });
        return;
      }

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        gender: genderValue,
        age: parseInt(values.age.replace("대", ""), 10),
        phone_number: values.phone,
        organization_code: values.organizationCode.trim() || undefined,
      };

      const res = await signup(payload);

      if (res.code === 1000 || res.status === "OK") {
        setStep(3);
        return;
      }

    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "회원가입 중 문제가 발생했습니다.";

      openModal({
        type: "error",
        title: "오류 발생",
        message: errorMsg,
      });
    }
  };

  const hasError = (k: string) => !!errors[k] && touched[k];

  return (
    <>
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-bg-card rounded-2xl shadow-base p-8 lg:p-12">
          {/* 로고 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">회원가입</h1>
            <p className="text-text-secondary text-sm">Privideo에 오신 것을 환영합니다</p>
          </div>

          {/* 단계 표시 */}
          <StepIndicator currentStep={step} steps={steps} onStepClick={setStep} />

          {/* 폼 */}
          <form onSubmit={handleSubmit} noValidate className="mt-8">
            {/* Step 1: 약관 동의 */}
            {step === 1 && (
              <>
                <AgeGroupSelect
                  value={values.ageGroup}
                  onChange={(value) => handleChange('ageGroup', value)}
                  onBlur={() => handleBlur('ageGroup')}
                  error={hasError('ageGroup') ? errors.ageGroup : undefined}
                />

                <div className="my-6 border-t border-border-light"></div>

                <TermsAgreement
                  agreeAll={values.agreeAll}
                  agreeTos={values.agreeTos}
                  agreePrivacy={values.agreePrivacy}
                  agreeMarketing={values.agreeMarketing}
                  onChange={(key, value) => handleChange(key as keyof typeof values, value)}
                  onBlur={handleBlur}
                  errors={{
                    agreeTos: hasError('agreeTos') ? errors.agreeTos : undefined,
                    agreePrivacy: hasError('agreePrivacy') ? errors.agreePrivacy : undefined,
                  }}
                />

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </>
            )}

            {/* Step 2: 정보 입력 */}
            {step === 2 && (
              <>
                <RegisterForm
                  values={values}
                  onChange={(key, value) => handleChange(key as keyof typeof values, value)}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  hasError={hasError}
                />

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 bg-bg-page text-text-primary rounded-lg font-semibold hover:bg-border-light transition-colors"
                  >
                    이전
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors"
                  >
                    가입완료
                  </button>
                </div>
              </>
            )}

            {/* Step 3: 가입 완료 */}
            {step === 3 && (
              <RegisterComplete onLogin={() => navigate('/login')} />
            )}
          </form>
        </div>
      </div>
    </>
  );
}