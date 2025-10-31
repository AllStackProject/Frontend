import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiCloud, HiShare, HiLockClosed, HiMenu, HiX } from 'react-icons/hi';
import Footer from "@/components/Common/Footer";

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const isAuthenticated = false;

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <HiShieldCheck className="w-12 h-12" />,
      title: '안전한 영상 관리',
      description: '엔터프라이즈급 보안으로 소중한 영상을 안전하게 보호합니다.',
    },
    {
      icon: <HiCloud className="w-12 h-12" />,
      title: '하이브리드 클라우드',
      description: '퍼블릭과 프라이빗 클라우드를 결합한 최적의 스토리지를 제공합니다.',
    },
    {
      icon: <HiShare className="w-12 h-12" />,
      title: '간편한 공유',
      description: '링크 하나로 원하는 사람과 안전하게 영상을 공유할 수 있습니다.',
    },
    {
      icon: <HiLockClosed className="w-12 h-12" />,
      title: '세밀한 권한 관리',
      description: '조직별, 사용자별로 접근 권한을 세밀하게 제어할 수 있습니다.',
    },
  ];

  const pricingPlans = [
    {
      name: '무료',
      users: '최대 30명까지',
      storage: '최대 100GB',
      price: null,
      priceLabel: '무료',
      features: [
        '기본 영상 업로드',
        '기본 공유 기능',
        '커뮤니티 지원',
      ],
    },
    {
      name: '플러스',
      users: '최대 100명까지',
      storage: '최대 500GB',
      price: 30000,
      priceLabel: '월 3만원',
      features: [
        '무료 플랜의 모든 기능',
        '고급 공유 옵션',
        '이메일 지원',
        '기본 분석 리포트',
      ],
      popular: true,
    },
    {
      name: '비즈니스',
      users: '최대 500명까지',
      storage: '최대 3TB',
      price: 70000,
      priceLabel: '월 7만원',
      features: [
        '플러스 플랜의 모든 기능',
        '고급 권한 관리',
        '우선 지원',
        '상세 분석 대시보드',
        'API 접근',
      ],
    },
    {
      name: '비즈니스 플러스',
      users: '최대 1000명까지',
      storage: '최대 10TB',
      price: 100000,
      priceLabel: '월 10만원',
      features: [
        '비즈니스 플랜의 모든 기능',
        '전담 계정 매니저',
        '24/7 우선 지원',
        '커스텀 통합',
        '고급 보안 기능',
      ],
    },
    {
      name: '엔터프라이즈',
      users: '영업팀에 문의',
      storage: '영업팀에 문의',
      price: null,
      priceLabel: '영업팀에 문의',
      features: [
        '비즈니스 플러스의 모든 기능',
        '무제한 저장공간',
        '무제한 조직원',
        '맞춤형 계약',
        'SLA 보장',
        '온프레미스 옵션',
      ],
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 backdrop-blur-lg border-b z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 border-border-light shadow-sm' : 'bg-white/80 border-transparent'
        }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 px-2 sm:px-4 md:px-8 cursor-pointer hover:opacity-80 transition"
              onClick={() => navigate("/")}
            >
              <img src="/logo.png" alt="Privideo" className="w-40" />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('product')} className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                제품
              </button>
              <button onClick={() => scrollToSection('features')} className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                기능
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                요금제
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/login')} className="px-4 py-2 text-text-primary hover:bg-bg-page rounded-lg transition-colors text-sm font-medium">
                    로그인
                  </button>
                  <button onClick={handleGetStarted} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                    무료로 시작하기 →
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/home')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                  대시보드로 이동 →
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-border-light pt-4 space-y-3">
              <button onClick={() => scrollToSection('product')} className="block w-full text-left text-text-secondary hover:text-text-primary py-2">제품</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-text-secondary hover:text-text-primary py-2">기능</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-text-secondary hover:text-text-primary py-2">요금제</button>
              <hr className="border-border-light my-2" />
              {!isAuthenticated ? (
                <>
                  <button onClick={() => navigate('/login')} className="block w-full text-left text-text-primary py-2 font-medium">로그인</button>
                  <button onClick={handleGetStarted} className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                    무료로 시작하기
                  </button>
                </>
              ) : (
                <button onClick={() => navigate('/home')} className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm font-medium">
                  대시보드로 이동
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight animate-fade-in-up">
            더 안전하고 <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
              스마트한 영상 관리
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-text-secondary mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Privideo는 하이브리드 클라우드 기반의 프라이빗 영상 공유 플랫폼입니다.
            팀과 조직의 소중한 영상을 안전하게 저장하고 공유하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-light transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              {isAuthenticated ? '대시보드로 이동 →' : '무료로 시작하기 →'}
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-8 py-4 bg-bg-page text-text-primary rounded-lg hover:bg-border-light transition-all duration-300 text-lg font-semibold hover:scale-105 transform"
            >
              요금제 보기
            </button>
          </div>
        </div>

        {/* Floating animation elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-60 right-20 w-32 h-32 bg-accent/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-primary/5 rounded-full animate-float animation-delay-2000"></div>
      </section>

      {/* Product Overview */}
      <section id="product" className="py-20 bg-bg-page scroll-mt-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4 animate-on-scroll">
              모든 영상을 한곳에서
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto animate-on-scroll animation-delay-200">
              업로드부터 공유, 분석까지. Privideo로 영상 관리의 모든 것을 경험하세요.
            </p>
          </div>

          {/* Product Visual with animation */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse"></div>
            <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-500">
              <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                <span className="text-5xl text-white">🎬</span>
              </div>
              <p className="text-text-muted text-lg">제품 데모 영역</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              강력한 기능
            </h2>
            <p className="text-lg text-text-secondary">
              Privideo가 제공하는 핵심 기능들을 만나보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-bg-page p-8 rounded-2xl hover:shadow-xl transition-all duration-300 animate-on-scroll transform hover:-translate-y-2 group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300 w-12 h-12">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-bg-page px-6 scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              팀에 딱 맞는 요금제
            </h2>
            <p className="text-lg text-text-secondary">
              조직 규모에 맞는 플랜을 선택하세요
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-base">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left p-6 text-sm font-semibold text-text-muted bg-bg-page">요금제명</th>
                  {pricingPlans.map((plan, index) => (
                    <th
                      key={index}
                      className={`p-6 text-center relative transition-all duration-300 cursor-pointer ${hoveredPlan === index ? 'bg-primary/10' : ''
                        }`}
                      onMouseEnter={() => setHoveredPlan(index)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      {plan.popular && (
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full font-semibold">
                          인기
                        </span>
                      )}
                      <div className={`text-lg font-bold text-text-primary ${plan.popular ? 'mt-4' : ''}`}>
                        {plan.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-light">
                  <td className="p-6 text-sm font-medium text-text-secondary bg-bg-page">조직원</td>
                  {pricingPlans.map((plan, index) => (
                    <td
                      key={index}
                      className={`p-6 text-center text-sm text-text-secondary transition-all duration-300 cursor-pointer ${hoveredPlan === index ? 'bg-primary/10' : ''
                        }`}
                      onMouseEnter={() => setHoveredPlan(index)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      {plan.users}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-light">
                  <td className="p-6 text-sm font-medium text-text-secondary bg-bg-page">스토리지</td>
                  {pricingPlans.map((plan, index) => (
                    <td
                      key={index}
                      className={`p-6 text-center text-sm text-text-secondary transition-all duration-300 cursor-pointer ${hoveredPlan === index ? 'bg-primary/10' : ''
                        }`}
                      onMouseEnter={() => setHoveredPlan(index)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      {plan.storage}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border-light">
                  <td className="p-6 text-sm font-semibold text-text-primary bg-bg-page">가격</td>
                  {pricingPlans.map((plan, index) => (
                    <td
                      key={index}
                      className={`p-6 text-center transition-all duration-300 cursor-pointer ${hoveredPlan === index ? 'bg-primary/10' : ''
                        }`}
                      onMouseEnter={() => setHoveredPlan(index)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      <div className="text-2xl font-bold text-primary">{plan.priceLabel}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-6 bg-bg-page"></td>
                  {pricingPlans.map((plan, index) => (
                    <td
                      key={index}
                      className={`p-6 text-center transition-all duration-300 ${hoveredPlan === index ? 'bg-primary/10' : ''
                        }`}
                      onMouseEnter={() => setHoveredPlan(index)}
                      onMouseLeave={() => setHoveredPlan(null)}
                    >
                      <button
                        onClick={handleGetStarted}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${hoveredPlan === index
                            ? 'bg-primary text-white hover:bg-primary-light hover:shadow-lg'
                            : 'bg-bg-page hover:bg-border-light text-text-primary hover:shadow-md'
                          }`}
                      >
                        시작하기
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            무료 플랜으로 Privideo를 경험해보세요. 신용카드 없이 시작할 수 있습니다.
          </p>
          <button onClick={handleGetStarted} className="px-10 py-4 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-lg font-semibold shadow-lg">
            {isAuthenticated ? '대시보드로 이동 →' : '무료로 시작하기 →'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}