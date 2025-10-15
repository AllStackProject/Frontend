// src/pages/Auth/LoginSelect.tsx
import { useNavigate } from 'react-router-dom';

// 조직 데이터 타입
interface Organization {
  id: string;
  name: string;
  image?: string;
}

export default function LoginSelect() {
  const navigate = useNavigate();

  // 임시 사용자 이름 (나중에 API에서 받아올 예정)
  const userName = '홍길동';

  // TODO: 실제로는 백엔드에서 사용자의 조직 목록을 가져와야 함
  const organizations: Organization[] = [
    { id: '1', name: '우리 FISA' },
    { id: '2', name: '에듀윌' },
    { id: '3', name: '메가스터디' },
    { id: '4', name: '피사대학교' },
  ];

  const handleSelectOrg = (org: Organization) => {
    // TODO: 선택한 조직 정보 저장 (백엔드 API 연동)
    console.log('선택한 조직:', org);
    
    // 메인 홈으로 이동
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-bg-card rounded-2xl shadow-base p-12">
        {/* 상단 헤더 영역 */}
        <div className="border-b border-border-light pb-8 mb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-3">
              {userName}님 반갑습니다!
            </h1>
            <p className="text-lg text-text-secondary">
              어느 조직으로 접속할까요?
            </p>
          </div>
        </div>

        {/* 조직 선택 그리드 */}
        <div className="bg-bg-section rounded-xl p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className="flex flex-col items-center gap-4 p-6 bg-bg-card rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 group"
              >
                {/* 조직 이미지 (원형) */}
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
                  {org.image ? (
                    <img
                      src={org.image}
                      alt={org.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-text-muted font-medium">
                      {org.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* 조직 이름 */}
                <span className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {org.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}