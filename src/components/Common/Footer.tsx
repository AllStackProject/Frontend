import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#242b35] text-gray-300 text-sm mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 상단: 로고 + 메뉴 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-12">
          {/* 로고 + 문구 */}
          <div className="flex items-center md:items-start gap-4 w-full md:w-1/2">
            <img src="/logo.png" alt="Privideo Logo" className="w-40 h-30" />
          </div>

          {/* 메뉴 섹션 */}
          <div className="grid grid-cols-3 gap-12 w-full md:w-1/2 justify-items-start">
            <div>
              <h4 className="text-white font-semibold mb-3">Privideo</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors"
                  >
                    서비스 소개
                  </Link>
                </li>
                <li>공지사항</li>
                <li>블로그</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">이용 안내</h4>
              <ul className="space-y-2">
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>자주 묻는 질문</li>
                <li>고객센터</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">파트너</h4>
              <ul className="space-y-2">
                <li>비즈니스 제휴</li>
                <li>콘텐츠 제안</li>
                <li>마케팅 문의</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* 하단 정보 */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 text-center md:text-left gap-3">
          <p>
            © 2025 PRIVIDEO Corp. ALL RIGHTS RESERVED <br />
            대표: 홍길동 | 사업자등록번호: 000-00-00000 | 이메일: info@privideo.com
          </p>

          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">YouTube</a>
            <a href="#" className="hover:text-white">Blog</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;