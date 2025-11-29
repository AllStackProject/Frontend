import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { HiClock } from "react-icons/hi"
import { getWatchedVideos } from "@/api/myactivity/getWatchedVideos"
import { postVideoScrap, deleteVideoScrap } from "@/api/video/scrap"
import { Heart, PlayCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import type { WatchedVideo } from "@/types/video"
import { useAuth } from "@/context/AuthContext"

const LearningSection: React.FC = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState<WatchedVideo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const { orgName, orgId } = useAuth()

  /** 시청 기록 + 스크랩 목록 병합 로드 */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!orgId) {
          setError("조직 정보가 없습니다.")
          return
        }
        const data = await getWatchedVideos(orgId)
        setVideos(data)
      } catch (err: any) {
        console.error("🚨 시청 기록 로드 실패:", err)
        setError(err.message || "시청 기록을 불러오지 못했습니다.")
      }
    }

    fetchVideos()
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
      if (error.message?.includes("이미 스크랩")) {
        setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_scrapped: true } : v)))
      } else {
        alert(error.message || "스크랩 처리 중 오류가 발생했습니다.")
      }
    } finally {
      setLoadingId(null)
    }
  }

  /** 상세 이동 */
  const handleVideoClick = (id: number) => {
    navigate(`/video/${id}`)
  }

  // 초를 "분:초" 형태로 변환하는 유틸 함수
  const formatDuration = (seconds?: number): string => {
    if (!seconds && seconds !== 0) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
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
        <PlayCircle className="mx-auto mb-4 text-gray-300" size={56} strokeWidth={1.5} />
        <p className="text-gray-700 font-medium mb-1">{orgName}에서 시청한 영상이 없습니다.</p>
        <p className="text-gray-500 text-sm">첫 번째 영상을 시청해보세요!</p>
      </div>
    )
  }

  const videosToShow = isExpanded ? videos : videos.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">최근 시청 기록</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
            {videos.length}개
          </span>
        </div>

        {/* 더보기 / 접기 버튼 */}
        {videos.length > 6 && (
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-lg transition-all"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
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

      {/* 영상 카드 그리드 */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videosToShow.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video.id)}
            className="group cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* 썸네일 */}
            <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
              <img
                src={video.img || "/dummy/video-thumb.png"}
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

            {/* 카드 내용 */}
            <div className="p-3 space-y-3">
              {/* 제목 */}
              <h4 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug min-h-[44px]">
                {video.name}
              </h4>

              {/* 최근 시청일 */}
              <p className="text-xs text-gray-500">
                최근 시청일: {new Date(video.recent_watch).toLocaleDateString("ko-KR")}
              </p>

              {/* 진행률 바 */}
              <div className="space-y-1.5">
                <div className="relative w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${(video.watch_rate || 0).toFixed(0)}%` }}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                      (video.watch_rate || 0) >= 50 ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {(video.watch_rate || 0).toFixed(0)}%
                  </span>
                </div>

                {/* 완료 배지 */}
                {video.watch_rate === 100 && (
                  <div className="flex justify-end">
                    <span className="text-xs font-bold text-green-600">시청 완료</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LearningSection