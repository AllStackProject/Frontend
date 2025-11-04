interface TermsAgreementProps {
  agreeAll: boolean;
  agreeTos: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
  onChange: (key: string, value: boolean) => void;
  onBlur: (key: string) => void;
  errors: {
    agreeTos?: string;
    agreePrivacy?: string;
  };
}

export default function TermsAgreement({
  agreeAll,
  agreeTos,
  agreePrivacy,
  agreeMarketing,
  onChange,
  onBlur,
  errors,
}: TermsAgreementProps) {
  return (
    <div className="space-y-4">
      {/* 전체 동의 */}
      <label
        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
          agreeAll
            ? 'border-primary bg-primary/5'
            : 'border-border-light hover:border-primary/50 hover:bg-bg-page'
        }`}
      >
        <input
          type="checkbox"
          checked={agreeAll}
          onChange={(e) => onChange('agreeAll', e.target.checked)}
          className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded"
        />
        <div className="flex-1">
          <span className="text-text-primary font-semibold">전체동의</span>
          <p className="text-sm text-text-muted mt-1">
            이용약관, 개인정보 수집 및 이용, 마케팅 수신 동의(선택)
          </p>
        </div>
      </label>

      <div className="space-y-3">
        {/* 이용약관 */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTos}
              onChange={(e) => onChange('agreeTos', e.target.checked)}
              onBlur={() => onBlur('agreeTos')}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <span className="text-text-primary">
              이용약관 동의 <span className="text-error">*</span>
            </span>
          </label>
          {errors.agreeTos && (
            <p className="text-sm text-error mt-1 ml-7">{errors.agreeTos}</p>
          )}
        </div>

        {/* 개인정보 수집 */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => onChange('agreePrivacy', e.target.checked)}
              onBlur={() => onBlur('agreePrivacy')}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <span className="text-text-primary">
              개인정보 수집 및 이용 동의 <span className="text-error">*</span>
            </span>
          </label>
          {errors.agreePrivacy && (
            <p className="text-sm text-error mt-1 ml-7">{errors.agreePrivacy}</p>
          )}
        </div>

        {/* 마케팅 수신 (선택) */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeMarketing}
            onChange={(e) => onChange('agreeMarketing', e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary rounded"
          />
          <span className="text-text-muted">
            [선택] 마케팅 수신 동의
          </span>
        </label>
      </div>
    </div>
  );
}