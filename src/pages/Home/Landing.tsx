import { useState, useEffect } from 'react'
import { ChevronRight, Shield, Cloud, Share2, Lock, Menu, X, Check } from 'lucide-react'

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const isAuthenticated = false

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/home'
    } else {
      window.location.href = '/login'
    }
  }

  const features = [
    {
      icon: Shield,
      title: '안전한 영상 관리',
      description: '소중한 영상을 안전하게 보호합니다.',
    },
    {
      icon: Cloud,
      title: '하이브리드 클라우드',
      description: '퍼블릭과 프라이빗 클라우드를 결합한 최적의 스토리지를 제공합니다.',
    },
    {
      icon: Share2,
      title: '간편한 공유',
      description: '원하는 사람과 안전하게 영상을 공유할 수 있습니다.',
    },
    {
      icon: Lock,
      title: '세밀한 권한 관리',
      description: '조직별, 사용자별로 접근 권한을 세밀하게 제어할 수 있습니다.',
    },
  ]

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
        '기본 분석 리포트'
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
        '무제한 멤버',
        '맞춤형 계약',
      ],
    },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 backdrop-blur-lg border-b z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 border-[#E5E7EB] shadow-sm'
            : 'bg-white/80 border-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 px-2 sm:px-4 md:px-8 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => (window.location.href = '/')}
            >
              <img src="/logo.png" alt="Privideo" className="w-40" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('product')}
                className="text-[#4B5563] hover:text-[#1E1E1E] transition-colors text-sm font-medium"
              >
                제품
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-[#4B5563] hover:text-[#1E1E1E] transition-colors text-sm font-medium"
              >
                기능
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-[#4B5563] hover:text-[#1E1E1E] transition-colors text-sm font-medium"
              >
                요금제
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => (window.location.href = '/login')}
                    className="px-4 py-2 text-[#1E1E1E] hover:bg-[#F9FAFB] rounded-lg transition-colors text-sm font-medium"
                  >
                    로그인
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-all duration-200 text-sm font-medium hover:shadow-lg hover:scale-105 transform"
                  >
                    무료로 시작하기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => (window.location.href = '/home')}
                  className="px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-colors text-sm font-medium"
                >
                  대시보드로 이동
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-[#1E1E1E]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-[#E5E7EB] pt-4 space-y-3 animate-fade-in">
              <button
                onClick={() => scrollToSection('product')}
                className="block w-full text-left text-[#4B5563] hover:text-[#1E1E1E] py-2"
              >
                제품
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-[#4B5563] hover:text-[#1E1E1E] py-2"
              >
                기능
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-left text-[#4B5563] hover:text-[#1E1E1E] py-2"
              >
                요금제
              </button>
              <hr className="border-[#E5E7EB] my-2" />
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => (window.location.href = '/login')}
                    className="block w-full text-left text-[#1E1E1E] py-2 font-medium"
                  >
                    로그인
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-colors text-sm font-medium"
                  >
                    무료로 시작하기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => (window.location.href = '/home')}
                  className="w-full px-4 py-2 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-colors text-sm font-medium"
                >
                  대시보드로 이동
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden relative">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-5xl lg:text-7xl font-bold text-[#1E1E1E] mb-6 leading-tight animate-fade-in-up">
            더 안전하고 <br />
            <span className="text-[#3674B5]">스마트한 영상 관리</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[#4B5563] mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Privideo는 하이브리드 클라우드 기반의 프라이빗 영상 공유 플랫폼입니다.
            팀과 조직의 소중한 영상을 안전하게 저장하고 공유하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center gap-2"
            >
              {isAuthenticated ? '대시보드로 이동' : '무료로 시작하기'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-8 py-4 bg-[#F9FAFB] text-[#1E1E1E] rounded-lg hover:bg-[#E5E7EB] transition-all duration-300 text-lg font-semibold hover:scale-105 transform border border-[#E5E7EB]"
            >
              요금제 보기
            </button>
          </div>
        </div>

        {/* Floating animation elements */}
        <div className="absolute top-40 left-10 w-20 h-20 bg-[#3674B5]/10 rounded-full animate-float" />
        <div className="absolute top-60 right-20 w-32 h-32 bg-[#FADA7A]/20 rounded-full animate-float animation-delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-[#3674B5]/5 rounded-full animate-float animation-delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-[#578FCA]/10 rounded-full animate-float" />
      </section>

      {/* Product Overview */}
      <section
        id="product"
        className="py-20 bg-[#F9FAFB] scroll-mt-20 px-6"
        data-animate
      >
        <div className="container mx-auto max-w-6xl">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has('product')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1E1E] mb-4">
              모든 영상을 한곳에서
            </h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
              업로드부터 공유, 분석까지. Privideo로 영상 관리의 모든 것을 경험하세요.
            </p>
          </div>

          {/* Product Visual with animation */}
          <div
            className={`bg-gradient-to-br from-[#3674B5]/5 via-[#F5F0CD]/30 to-[#FADA7A]/20 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${
              visibleSections.has('product')
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3674B5]/5 to-[#FADA7A]/5 animate-pulse-slow" />
            <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-500">
              <div className="w-24 h-24 bg-[#3674B5] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                <span className="text-5xl">🎬</span>
              </div>
              <p className="text-[#9CA3AF] text-lg">제품 데모 영역</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 scroll-mt-20" data-animate>
        <div className="container mx-auto max-w-6xl">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has('features')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1E1E] mb-4">
              강력한 기능
            </h2>
            <p className="text-lg text-[#4B5563]">
              Privideo가 제공하는 핵심 기능들을 만나보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-xl hover:border-[#3674B5]/30 transition-all duration-300 transform hover:-translate-y-2 group ${
                    visibleSections.has('features')
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: visibleSections.has('features')
                      ? `${index * 100}ms`
                      : '0ms',
                  }}
                >
                  <div className="w-14 h-14 bg-[#3674B5]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#3674B5] transition-colors duration-300">
                    <Icon className="w-7 h-7 text-[#3674B5] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E1E1E] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#4B5563] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 bg-[#F9FAFB] px-6 scroll-mt-20"
        data-animate
      >
        <div className="container mx-auto max-w-7xl">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.has('pricing')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1E1E] mb-4">
              팀에 딱 맞는 요금제
            </h2>
            <p className="text-lg text-[#4B5563]">
              조직 규모에 맞는 플랜을 선택하세요
            </p>
          </div>

          {/* Card-based pricing for better responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 transform ${
                  plan.popular
                    ? 'border-[#3674B5] shadow-lg'
                    : 'border-[#E5E7EB] hover:border-[#3674B5]/50'
                } ${
                  visibleSections.has('pricing')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: visibleSections.has('pricing')
                    ? `${index * 100}ms`
                    : '0ms',
                }}
              >
                {plan.popular && (
                  <div className="bg-[#3674B5] text-white text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4">
                    인기
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-[#3674B5] mb-6">
                  {plan.priceLabel}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="text-sm text-[#4B5563]">
                    <span className="font-semibold">멤버:</span> {plan.users}
                  </div>
                  <div className="text-sm text-[#4B5563]">
                    <span className="font-semibold">스토리지:</span> {plan.storage}
                  </div>
                </div>
                <div className="border-t border-[#E5E7EB] pt-4 mb-6 space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#3674B5] mt-0.5 flex-shrink-0" />
                      <span className="text-[#4B5563]">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-[#3674B5] text-white hover:bg-[#578FCA] shadow-md'
                      : 'bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#1E1E1E]'
                  }`}
                >
                  시작하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1E1E] mb-6 animate-fade-in-up">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-[#4B5563] mb-8 animate-fade-in-up animation-delay-200">
            무료 플랜으로 Privideo를 경험해보세요. 신용카드 없이 시작할 수 있습니다.
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-10 py-4 bg-[#3674B5] text-white rounded-lg hover:bg-[#578FCA] transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform animate-fade-in-up animation-delay-400 inline-flex items-center gap-2"
          >
            {isAuthenticated ? '대시보드로 이동' : '무료로 시작하기'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <img src="/logowhite.png" alt="Privideo" className="w-32 mb-4 " />
              <p className="text-sm text-gray-400">
                간편하게 공유하는 “우리”만의 영상 공간
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                    기능
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">
                    요금제
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문의
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    고객센터
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문서
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 Privideo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
