import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Plus, X } from 'lucide-react';
import ConfirmActionModal from '@/components/common/modals/ConfirmActionModal';
import SuccessModal from '@/components/common/modals/SuccessModal';

// 조직 데이터 타입
interface Organization {
  id: string;
  name: string;
  image?: string;
  memberCount?: number;
}

export default function LoginSelect() {
  const navigate = useNavigate();

  // 임시 사용자 이름 (나중에 API에서 받아올 예정)
  const userName = '홍길동';

  // TODO: 실제로는 백엔드에서 사용자의 조직 목록을 가져와야 함
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: '1', name: '우리 FISA', image: '/dummy/woori-logo.png', memberCount: 245 },
    { id: '2', name: '에듀윌', image: '/dummy/woori-logo.png', memberCount: 180 },
    { id: '3', name: '메가스터디', image: '/dummy/woori-logo.png', memberCount: 320 },
    { id: '4', name: '피사대학교', image: '/dummy/woori-logo.png', memberCount: 156 },
  ]);

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [orgCode, setOrgCode] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedOrgName, setAddedOrgName] = useState('');

  // 색상 목록
  const availableColors = ['blue', 'purple', 'green', 'orange', 'red', 'indigo', 'pink', 'teal'];

  // ID 기반 랜덤 색상 생성 (같은 ID는 항상 같은 색상)
  const getRandomColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return availableColors[hash % availableColors.length];
  };

  // 색상별 그라데이션 및 스타일 정의
  const colorStyles: Record<string, {
    gradient: string;
    bg: string;
    text: string;
    ring: string;
    shadow: string;
  }> = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      ring: 'ring-blue-500',
      shadow: 'shadow-blue-200',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      ring: 'ring-purple-500',
      shadow: 'shadow-purple-200',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      text: 'text-green-600',
      ring: 'ring-green-500',
      shadow: 'shadow-green-200',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      ring: 'ring-orange-500',
      shadow: 'shadow-orange-200',
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50',
      text: 'text-red-600',
      ring: 'ring-red-500',
      shadow: 'shadow-red-200',
    },
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      ring: 'ring-indigo-500',
      shadow: 'shadow-indigo-200',
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      ring: 'ring-pink-500',
      shadow: 'shadow-pink-200',
    },
    teal: {
      gradient: 'from-teal-500 to-teal-600',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      ring: 'ring-teal-500',
      shadow: 'shadow-teal-200',
    },
  };

  const handleSelectOrg = (org: Organization) => {
    // TODO: 선택한 조직 정보 저장 (백엔드 API 연동)
    console.log('선택한 조직:', org);
    
    // 메인 홈으로 이동
    navigate('/home');
  };

  const handleAddOrganization = () => {
    // 입력 검증
    if (!orgCode.trim()) {
      setErrorMessage('조직 코드를 입력해주세요.');
      setShowErrorModal(true);
      return;
    }

    if (orgCode.trim().length !== 6) {
      setErrorMessage('조직 코드는 6자리 숫자여야 합니다.');
      setShowErrorModal(true);
      return;
    }

    if (!/^\d{6}$/.test(orgCode.trim())) {
      setErrorMessage('조직 코드는 숫자만 입력 가능합니다.');
      setShowErrorModal(true);
      return;
    }

    // TODO: 실제 API 호출
    // 임시로 성공 처리
    const newOrg: Organization = {
      id: String(organizations.length + 1),
      name: '새로운 조직',
      memberCount: 50,
    };

    setOrganizations([...organizations, newOrg]);
    setAddedOrgName(newOrg.name);
    setShowAddModal(false);
    setOrgCode('');
    setShowSuccessModal(true);
  };

  const getColorStyle = (orgId: string) => {
    const color = getRandomColor(orgId);
    return colorStyles[color] || colorStyles.blue;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* 상단 헤더 영역 */}
          <div className="text-center mb-12 mt-12">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Building2 size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-3">
              {userName}님 반갑습니다! 👋
            </h1>
            <p className="text-lg text-gray-600">
              어느 조직으로 접속할까요?
            </p>
          </div>

          {/* 조직 선택 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizations.map((org) => {
              const style = getColorStyle(org.id);
              
              return (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${style.shadow}`}
                >
                  {/* 상단 그라데이션 헤더 */}
                  <div className={`h-24 bg-gradient-to-br ${style.gradient} relative`}>
                    {/* 장식 원형들 */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                    
                    {/* 조직 이미지/아이콘 */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                      <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl ring-4 ring-white group-hover:scale-110 transition-transform duration-300`}>
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.name}
                            className="w-16 h-16 rounded-full object-contain p-2"
                          />
                        ) : (
                          <span className={`text-2xl font-bold ${style.text}`}>
                            {org.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 조직 정보 */}
                  <div className="pt-12 pb-4 px-4">
                    <h3 className="text-base font-bold text-gray-800 mb-1 text-center group-hover:text-gray-900 transition-colors">
                      {org.name}
                    </h3>
                    
                    {/* 멤버 수 */}
                    {org.memberCount && (
                      <p className="text-xs text-gray-500 text-center mb-2">
                        구성원 {org.memberCount.toLocaleString()}명
                      </p>
                    )}
                    
                    {/* 입장 버튼 */}
                    <div className={`mt-1 flex items-center justify-center gap-2 text-xs font-semibold ${style.text} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <span>입장하기</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* 호버 시 테두리 효과 */}
                  <div className={`absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:${style.ring} transition-all duration-300 pointer-events-none`}></div>
                </button>
              );
            })}

            {/* 조직 추가 카드 */}
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative overflow-hidden rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-blue-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-full flex flex-col items-center justify-center p-4 min-h-[220px]">
                <div className="w-20 h-20 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-3 transition-colors duration-300">
                  <Plus size={32} className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                  조직 추가하기
                </h3>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  6자리 조직 코드로<br />새로운 조직에 참여하세요
                </p>
              </div>
            </button>
          </div>

          {/* 하단 안내 문구 */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              참여한 조직이 보이지 않으면 관리자에게 문의하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 조직 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            {/* 헤더 */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                조직 추가하기
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setOrgCode('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="닫기"
              >
                <X size={22} />
              </button>
            </div>

            {/* 내용 */}
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 Tip:</span> 조직 관리자에게 6자리 조직 코드를 받아 입력하세요.
                </p>
              </div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                조직 코드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                {orgCode.length}/6 자리
              </p>
            </div>

            {/* 하단 */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setOrgCode('');
                }}
                className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddOrganization}
                disabled={orgCode.length !== 6}
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                조직 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 모달 */}
      {showErrorModal && (
        <ConfirmActionModal
          title="입력 오류"
          message={errorMessage}
          confirmText="확인"
          color="red"
          onConfirm={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <SuccessModal
          title="조직 추가 완료"
          message={`"${addedOrgName}" 조직이 추가되었습니다!`}
          autoClose={true}
          autoCloseDelay={2000}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
}