import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { HiClock } from "react-icons/hi"
import { getScrapVideos } from "@/api/myactivity/getScrap"
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap"
import type { ScrapVideo } from "@/types/scrap"
import { useAuth } from "@/context/AuthContext"

type ScrapVideoWithState = ScrapVideo & { is_scrapped?: boolean }

const ScrapSection: React.FC = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState<ScrapVideoWithState[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const { orgName, orgId } = useAuth()

  /** 스크랩 목록 불러오기 */
  useEffect(() => {
    const fetchScraps = async () => {
      try {
        setLoading(true)
        const data = await getScrapVideos(orgId || 0)
        const formatted = data.map((v: ScrapVideo) => ({
          ...v,
          is_scrapped: true,
        }))
        setVideos(formatted)
      } catch (err: any) {
        console.error("❌ [ScrapSection] 스크랩 목록 로드 실패:", err)
        setError(err.message || "스크랩 목록을 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }

    if (orgId) fetchScraps()
  }, [orgId])

  /** 스크랩 토글 */
  const toggleScrap = async (e: React.MouseEvent, id: number, currentState?: boolean) => {
    e.stopPropagation()
    if (loadingId === id) return
    setLoadingId(id)

    try {
      if (currentState) {
        const res = await deleteVideoScrap(orgId || 0, id)
        if (res.is_success) {
          setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_scrapped: false } : v)))
        }
      } else {
        const res = await postVideoScrap(orgId || 0, id)
        if (res.is_success) {
          setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_scrapped: true } : v)))
        }
      }
    } catch (error: any) {
      alert(error.message || "스크랩 처리 중 오류가 발생했습니다.")
    } finally {
      setLoadingId(null)
    }
  }

  /** 영상 상세 이동 */
  const handleNavigate = (id: number) => {
    navigate(`/video/${id}`)
  }

  // 초를 "분:초" 형태로 변환하는 유틸 함수
  const formatDuration = (seconds?: number): string => {
    if (!seconds && seconds !== 0) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-rose-600" size={32} />
          <p className="text-sm text-gray-500">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm">
        <Heart className="mx-auto mb-4 text-gray-300" size={56} strokeWidth={1.5} />
        <p className="text-gray-700 font-medium mb-1">{orgName}에 스크랩한 영상이 없습니다.</p>
        <p className="text-gray-500 text-sm">다시 보고 싶은 영상을 스크랩해 보세요!</p>
      </div>
    )
  }

  const videosToShow = showAll ? videos : videos.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">스크랩한 영상</h2>
          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-sm font-semibold rounded-full">
            {videos.length}개
          </span>
        </div>

        {/* 더보기 / 접기 버튼 */}
        {videos.length > 4 && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:text-rose-700 font-semibold hover:bg-rose-50 rounded-lg transition-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                접기 <ChevronUp size={16} />
              </>
            ) : (
              <>
                더보기 <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>

      {/* 영상 리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {videosToShow.map((video) => (
          <div
            key={video.id}
            onClick={() => handleNavigate(video.id)}
            className="group cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* 썸네일 */}
              <div className="relative w-full md:w-64 h-36 md:h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={video.img || "/dummy/thumb1.png"}
                  alt={video.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* 재생 시간 오버레이 */}
                <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <HiClock size={14} />
                  {formatDuration(video.whole_time)}
                </div>

                {/* 스크랩 버튼 */}
                <button
                  onClick={(e) => toggleScrap(e, video.id, video.is_scrapped)}
                  disabled={loadingId === video.id}
                  className={`
                    absolute top-3 right-3 
                    bg-white/90 backdrop-blur-sm hover:bg-white 
                    rounded-full p-2 shadow-lg 
                    transition-all duration-200
                    ${loadingId === video.id ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
                  `}
                >
                  {loadingId === video.id ? (
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                  ) : (
                    <Heart
                      className={`transition-all duration-200 ${
                        video.is_scrapped
                          ? "text-rose-500 fill-rose-500"
                          : "text-gray-400 hover:text-rose-400"
                      }`}
                      size={20}
                    />
                  )}
                </button>
              </div>

              {/* 동영상 정보 */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  {/* 제목 */}
                  <h4 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
                    {video.name}
                  </h4>

                  {/* 최근 시청일 */}
                  <p className="text-sm text-gray-500">
                    최근 시청일: {new Date(video.recent_watch).toLocaleDateString("ko-KR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrapSection