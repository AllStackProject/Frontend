// src/components/Auth/AgeGroupSelect.tsx

interface AgeGroupSelectProps {
  value: '' | 'over14' | 'under14';
  onChange: (value: 'over14' | 'under14') => void;
  onBlur: () => void;
  error?: string;
}

export default function AgeGroupSelect({ value, onChange, onBlur, error }: AgeGroupSelectProps) {
  const options = [
    { value: 'over14' as const, label: '만 14세 이상입니다' },
    { value: 'under14' as const, label: '만 14세 미만입니다', sub: '보호자 동의가 필요합니다' },
  ];

  return (
    <fieldset className="space-y-3">
      <legend className="text-lg font-semibold text-text-primary mb-4">
        연령대 선택 <span className="text-error">*</span>
      </legend>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border-light hover:border-primary/50 hover:bg-bg-page'
            }`}
          >
            <input
              type="radio"
              name="ageGroup"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value as 'over14' | 'under14')}
              onBlur={onBlur}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <span className="text-text-primary font-medium">{option.label}</span>
              {option.sub && (
                <p className="text-sm text-text-muted mt-1">{option.sub}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}
    </fieldset>
  );
}