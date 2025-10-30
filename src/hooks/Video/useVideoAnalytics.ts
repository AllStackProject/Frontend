import { useEffect, useRef } from "react";
import { flushSession } from "@/api/Video/session";
import { sendVideoEvents } from "@/api/Video/event";

export type AnalyticsEventType = "JOIN" | "PLAY" | "PAUSE" | "SEEK" | "END" | "LEAVE";
export type AnalyticsEvent = {
    type: AnalyticsEventType;
    position: number;      
    timestamp: number;   
    metadata?: Record<string, any>;
};

type Params = {
    userId: number;
    videoId: number;
    orgId?: number;
    getVideoEl: () => HTMLVideoElement | null;
};

export function useVideoAnalytics({ userId, videoId, orgId, getVideoEl }: Params) {
    // 세션 & 버퍼
    const sessionId = useRef<string | null>(null);
    const eventBuffer = useRef<AnalyticsEvent[]>([]);
    const watchedSegments = useRef<Set<number>>(new Set());

    // 재생 상태
    const joined = useRef(false);
    const isPlaying = useRef(false);
    const isSeeking = useRef(false);
    const endedSent = useRef(false);
    const lastPos = useRef(0);           
    const startedAt = useRef(Date.now());

    // ===== 공통 헬퍼 =====
    const addEvent = (type: AnalyticsEventType, position: number, metadata?: Record<string, any>) => {
        const e = { type, position, timestamp: Date.now(), metadata };
        eventBuffer.current.push(e);
        console.log(`📘 [이벤트 추가] ${type}`, e);
    };

    const markWatchedRange = (from: number, to: number) => {
        const s = Math.floor(Math.max(0, from) / 10);
        const e = Math.floor(Math.max(0, to) / 10);
        for (let i = s; i <= e; i++) watchedSegments.current.add(i);
    };

    const nearEnd = (v: HTMLVideoElement) =>
        v.duration > 0 && v.currentTime >= v.duration - 1;

    const buildFlushBody = (v: HTMLVideoElement, hadEnd: boolean) => ({
        sessionId: sessionId.current as string,
        endedAt: Date.now(),
        actualWatchSec: watchedSegments.current.size * 10,
        watchedSegCnt: watchedSegments.current.size,
        hadEnd,
        recentPositionSec: v.currentTime || 0,
        durationSec: v.duration || 0,
    });

    // 이벤트 버퍼를 서버로 전송
    const sendEventBuffer = async () => {
        if (eventBuffer.current.length === 0 || !sessionId.current) return;

        try {
            const events = [...eventBuffer.current];
            console.log("📤 [이벤트 버퍼 전송 시작]", events.length, "개");

            const result = await sendVideoEvents({
                sessionId: sessionId.current,
                events,
            });

            if (result.ok) {
                // 전송 성공 시 버퍼 초기화
                eventBuffer.current = [];
                console.log("✅ [이벤트 버퍼 전송 완료]", result.recorded, "개 기록됨");
            }
        } catch (error) {
            console.error("❌ [이벤트 버퍼 전송 실패]", error);
        }
    };

    // ===== 1) JOIN (StrictMode 중복 방지) =====
    useEffect(() => {
        if (!joined.current) {
            joined.current = true;

            // 클라이언트에서 즉시 sessionId 생성
            sessionId.current = crypto.randomUUID();
            console.log(`🆔 [세션 생성] sessionId=${sessionId.current}`);

            // JOIN 이벤트 추가
            addEvent("JOIN", 0, { startedAt: startedAt.current, orgId, videoId, userId });

            // 초기 lastPos 설정
            const v = getVideoEl();
            if (v) lastPos.current = v.currentTime || 0;

            // Mock: 세션 시작 정보 콘솔 출력
            console.log("📋 [세션 시작 정보]", {
                sessionId: sessionId.current,
                userId,
                videoId,
                orgId,
                startedAt: new Date(startedAt.current).toISOString(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, videoId, orgId]);

    // ===== 2) 1초 루프: 재생 중 + 탐색 아님일 때만 커버리지 기록 =====
    useEffect(() => {
        const tick = setInterval(() => {
            const v = getVideoEl();
            if (!v || !sessionId.current) return;

            // near-end 감지(ended 이벤트 안 오는 브라우저 대비)
            if (!endedSent.current && nearEnd(v) && !v.paused) {
                console.log("🏁 [1초 루프] ✅ near-end 감지 → END 이벤트 처리");
                console.log("  - currentTime:", v.currentTime);
                console.log("  - duration:", v.duration);
                console.log("  - paused:", v.paused);

                endedSent.current = true;
                isPlaying.current = false;
                markWatchedRange(lastPos.current, v.duration || lastPos.current);
                addEvent("END", v.duration || 0, {
                    watchedSegments: Array.from(watchedSegments.current),
                    via: "near-end-loop"
                });

                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                console.log("📊 [최종 통계 - END (near-end)]");
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                console.log("  세션 ID:", sessionId.current);
                console.log("  전체 시청 구간:", Array.from(watchedSegments.current));
                console.log("  시청 구간 수:", watchedSegments.current.size);
                console.log("  실제 시청 시간:", watchedSegments.current.size * 10, "초");
                console.log("  영상 길이:", v.duration || 0, "초");
                console.log("  시청률:", ((watchedSegments.current.size * 10 / (v.duration || 1)) * 100).toFixed(1), "%");
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

                // 이벤트 버퍼 전송
                void sendEventBuffer();

                // 세션 종료 정보 전송
                const body = buildFlushBody(v, true);
                void flushSession(body);
                return;
            }

            if (isPlaying.current && !isSeeking.current) {
                // 정상 재생으로 간주 → 커버리지
                const now = v.currentTime || 0;
                const diff = Math.abs(now - lastPos.current);

                // 연속된 재생 구간만 기록 (2초 이내 변화)
                if (diff > 0 && diff < 2) {
                    markWatchedRange(lastPos.current, now);
                    console.log(`📹 [시청 기록] ${lastPos.current.toFixed(1)}초 ~ ${now.toFixed(1)}초`);
                } else if (diff >= 2) {
                    console.log(`⏭️ [점프 감지] ${lastPos.current.toFixed(1)}초 → ${now.toFixed(1)}초 (${diff.toFixed(1)}초 차이)`);
                }

                lastPos.current = now;
            }
        }, 1000);

        return () => clearInterval(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVideoEl]);

    // ===== 3) 10초마다 디버그 로그 =====
    useEffect(() => {
        const interval = setInterval(() => {
            if (eventBuffer.current.length || watchedSegments.current.size) {
                console.log("🧠 [버퍼 상태]");
                console.log("  - 이벤트 목록:", eventBuffer.current);
                console.log("  - 시청 구간:", Array.from(watchedSegments.current));
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // ===== 4) 페이지 이탈/숨김/언마운트 시 FLUSH =====
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState !== "hidden") return;
            const v = getVideoEl();
            if (!v || !sessionId.current || endedSent.current) return;

            console.log("🚪 [LEAVE - visibilitychange] ✅ 페이지 숨김");
            const body = buildFlushBody(v, nearEnd(v));
            addEvent("LEAVE", v.currentTime || 0, { reason: "visibilitychange" });
            console.log("📋 [MOCK - 콘솔만] LEAVE 정보", body);
        };

        const handlePageHide = () => {
            const v = getVideoEl();
            if (!v || !sessionId.current || endedSent.current) return;

            console.log("🚪 [LEAVE - pagehide] ✅ 페이지 종료");
            const body = buildFlushBody(v, nearEnd(v));
            addEvent("LEAVE", v.currentTime || 0, { reason: "pagehide" });
            console.log("📋 [MOCK - 콘솔만] LEAVE 정보", body);
        };

        const handleBeforeUnload = () => {
            const v = getVideoEl();
            if (!v || !sessionId.current || endedSent.current) return;

            console.log("🚪 [LEAVE - beforeunload] ✅ 페이지 언로드");
            const body = buildFlushBody(v, nearEnd(v));
            addEvent("LEAVE", v.currentTime || 0, { reason: "beforeunload" });
            console.log("📋 [MOCK - 콘솔만] LEAVE 정보", body);
        };

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("pagehide", handlePageHide);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // ✅ cleanup에서는 이벤트 리스너만 제거 (LEAVE X)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [getVideoEl]);

    // ===== 5) 외부에서 연결할 비디오 이벤트 핸들러 =====
    const onPlay = () => {
        const v = getVideoEl();
        if (!v) return;
        isPlaying.current = true;

        // 재생 시작 시점을 기준점으로 설정
        const currentPos = v.currentTime || 0;
        lastPos.current = currentPos;

        addEvent("PLAY", currentPos);
        console.log("▶️ [재생 시작]", currentPos.toFixed(2), "초부터 재생");
    };

    const onPause = () => {
        const v = getVideoEl();
        if (!v) return;

        // 영상 종료 근처(마지막 1초 이내)면 PAUSE 이벤트 무시
        // ended 이벤트가 곧 발생할 것이므로
        if (nearEnd(v)) {
            console.log("⏸️ [일시정지 무시] 영상 종료 근처이므로 END 이벤트 대기");

            // 시청 구간은 기록
            if (isPlaying.current && !isSeeking.current) {
                markWatchedRange(lastPos.current, v.currentTime || lastPos.current);
                lastPos.current = v.currentTime || lastPos.current;
            }

            isPlaying.current = false;
            return;
        }

        if (isPlaying.current && !isSeeking.current) {
            markWatchedRange(lastPos.current, v.currentTime || lastPos.current);
            lastPos.current = v.currentTime || lastPos.current;
        }
        isPlaying.current = false;
        addEvent("PAUSE", v.currentTime, { watchedSegments: Array.from(watchedSegments.current) });
    };

    const onSeeking = () => {
        const v = getVideoEl();
        if (!v) return;

        // seeking 시작 시 상태만 업데이트
        // 시청 구간은 seeking 전까지만 기록해야 하므로
        // onPause나 1초 루프에서 자동으로 처리됨

        isSeeking.current = true;
        isPlaying.current = !v.paused; // 상태 동기화
    };

    const onSeeked = () => {
        const v = getVideoEl();
        if (!v) return;
        isSeeking.current = false;

        // seeking 완료 후 새 위치를 기준점으로 설정
        const newPos = v.currentTime || 0;
        lastPos.current = newPos;

        addEvent("SEEK", newPos, { source: "user" });
        console.log("⏩ [사용자 탐색 완료]", newPos.toFixed(2), "초 → lastPos 갱신");
    };

    const onEnded = async () => {
        const v = getVideoEl();
        if (!v) {
            console.warn("⚠️ [onEnded] 비디오 엘리먼트 없음");
            return;
        }

        if (!sessionId.current) {
            console.error("❌ [onEnded] 세션 ID 없음 (치명적 오류)");
            return;
        }

        if (endedSent.current) {
            console.warn("⚠️ [onEnded] 이미 END 이벤트 전송됨 (중복 방지)");
            return;
        }

        console.log("🏁 [onEnded 호출] ✅ END 이벤트 처리 시작");

        endedSent.current = true;
        isPlaying.current = false;

        // 마지막 구간 기록
        const currentPos = v.currentTime || v.duration || 0;
        if (currentPos > lastPos.current && (currentPos - lastPos.current) < 2) {
            markWatchedRange(lastPos.current, currentPos);
        }

        addEvent("END", v.duration || 0, {
            watchedSegments: Array.from(watchedSegments.current),
            via: "ended-event"
        });

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📊 [최종 통계 - END]");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("  세션 ID:", sessionId.current);
        console.log("  전체 시청 구간:", Array.from(watchedSegments.current));
        console.log("  시청 구간 수:", watchedSegments.current.size);
        console.log("  실제 시청 시간:", watchedSegments.current.size * 10, "초");
        console.log("  영상 길이:", v.duration || 0, "초");
        console.log("  시청률:", ((watchedSegments.current.size * 10 / (v.duration || 1)) * 100).toFixed(1), "%");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        // 이벤트 버퍼 전송
        await sendEventBuffer();

        // 세션 종료 정보 전송
        const body = buildFlushBody(v, true);
        await flushSession(body);

        console.log("✅ [영상 종료 처리 완료]");
    };

    return {
        onPlay,
        onPause,
        onSeeking,
        onSeeked,
        onEnded,
    };
}