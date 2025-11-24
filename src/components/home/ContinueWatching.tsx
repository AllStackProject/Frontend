import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { getWatchedVideos } from "@/api/myactivity/getWatchedVideos"
import type { WatchedVideo } from "@/types/video"
import { PlayCircle, MessageCircleMore, Settings, Heart, ChevronLeft, ChevronRight, Clock } from "lucide-react"

const ContinueWatching = () => {
  const { orgId, nickname } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState<WatchedVideo[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // 상대적 날짜 표시 함수
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "오늘"
    } else if (diffDays === 1) {
      return "어제"
    } else if (diffDays < 7) {
      return `${diffDays}일 전`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}주 전`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months}개월 전`
    } else {
      return date.toLocaleDateString("ko-KR")
    }
  }

  useEffect(() => {
    if (!orgId) return

    const load = async () => {
      try {
        const data = await getWatchedVideos(orgId)
        setVideos(data)
      } catch (err) {
        console.error("❌ continue watching fetch 실패:", err)
      }
    }

    load()
  }, [orgId])

  // 스크롤 가능 여부 체크
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollability()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollability)
      window.addEventListener("resize", checkScrollability)
      return () => {
        container.removeEventListener("scroll", checkScrollability)
        window.removeEventListener("resize", checkScrollability)
      }
    }
  }, [videos])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 260 // 카드 너비(240) + 간격(20)
    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })
  }

  if (videos.length === 0) return <QuickMenu />

  const displayVideos = videos.slice(0, 3)

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">{nickname}님의 시청 중인 영상</h2>
        <button
          onClick={() => navigate("/orgmypage/learning")}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          모두 보기 →
        </button>
      </div>

      <div className="relative">
        {/* 왼쪽 화살표 */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full 
              bg-white border border-gray-300 shadow-lg
              flex items-center justify-center
              hover:bg-gray-50 hover:border-gray-400
              transition-all duration-200
              -translate-x-1/2
            "
            aria-label="이전 영상"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}

        {/* 오른쪽 화살표 */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full 
              bg-white border border-gray-300 shadow-lg
              flex items-center justify-center
              hover:bg-gray-50 hover:border-gray-400
              transition-all duration-200
              translate-x-1/2
            "
            aria-label="다음 영상"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}

        {/* 비디오 리스트 */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto py-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayVideos.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`/video/${v.id}`)}
              className="
                min-w-[240px] w-[240px] flex-shrink-0 cursor-pointer 
                bg-gradient-to-br from-gray-50 to-white
                border border-gray-200 rounded-xl 
                hover:shadow-lg hover:border-blue-300 
                hover:-translate-y-1
                transition-all duration-300 p-5
              "
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900  line-clamp-2 min-h-[20px]">
                  {v.name}
                </p>

                <div className="relative w-full h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${v.watch_rate}%`,
                      background: `linear-gradient(90deg, #8b5cf6, #6366f1)`,
                    }}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                      v.watch_rate >= 50 ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {v.watch_rate}%
                  </span>
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12}/>
                  <span className="font-medium">{getRelativeTime(v.recent_watch)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ContinueWatching

/* ============================================================
   QuickMenu
============================================================ */
const QuickMenu = () => {
  const navigate = useNavigate()

  const menu = [
    { icon: <Heart size={22} />, label: "스크랩", to: "/orgmypage/scrap", color: "text-rose-500" },
    { icon: <PlayCircle size={22} />, label: "업로드한 영상", to: "/orgmypage/myvideo", color: "text-blue-500" },
    { icon: <MessageCircleMore size={22} />, label: "내 댓글", to: "/orgmypage/comment", color: "text-green-500" },
    { icon: <Settings size={22} />, label: "설정", to: "/orgmypage/orgsetting", color: "text-gray-500" },
  ]

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">빠른 메뉴</h2>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menu.map((m, i) => (
            <button
              key={i}
              onClick={() => navigate(m.to)}
              className="
                flex items-center justify-between
                bg-gradient-to-br from-gray-50 to-white
                border border-gray-200 
                rounded-xl shadow-sm
                px-5 py-4
                hover:shadow-md hover:border-blue-300
                hover:-translate-y-0.5
                transition-all duration-300
                group
              "
            >
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                {m.label}
              </span>
              <div className={`${m.color} group-hover:scale-110 transition-transform duration-300`}>
                {m.icon}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}