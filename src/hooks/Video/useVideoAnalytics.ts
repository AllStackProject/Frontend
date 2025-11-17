import { useEffect, useRef } from "react";
import { leaveVideoSession } from "@/api/video/video";

export type AnalyticsEventType =
    | "JOIN"
    | "PLAY"
    | "PAUSE"
    | "SEEK"
    | "END"
    | "LEAVE";

export type AnalyticsEvent = {
    type: AnalyticsEventType;
    position: number;
    timestamp: number;
    metadata?: Record<string, any>;
};

type Params = {
    sessionId: string;
    videoId: number;
    orgId: number;
    wholeTime: number;
    getVideoEl: () => HTMLVideoElement | null;
};

export function useVideoAnalytics({
    sessionId,
    videoId,
    orgId,
    wholeTime,
    getVideoEl,
}: Params) {
    // ===== 내부 상태 =====
    const eventBuffer = useRef<AnalyticsEvent[]>([]);
    const watchedSegments = useRef<Set<number>>(new Set()); // 10초 단위 segment 인덱스

    const joined = useRef(false);
    const isPlaying = useRef(false);
    const isSeeking = useRef(false);
    const endedSent = useRef(false);
    const lastPos = useRef(0);
    const startedAt = useRef(Date.now());

    const SEGMENT_SIZE = 10; // 10초 단위

    /** 이벤트 버퍼에 기록 (지금은 서버 전송용이라기보다 디버깅/확장 대비) */
    const addEvent = (
        type: AnalyticsEventType,
        position: number,
        metadata?: Record<string, any>
    ) => {
        const e: AnalyticsEvent = {
            type,
            position,
            timestamp: Date.now(),
            metadata,
        };
        eventBuffer.current.push(e);
        // 디버깅용 로그
        // console.log("📘 [EVT]", e);
    };

    /** 시청 구간 기록 (from~to 를 10초 segment 기준으로 1로 세팅) */
    const markWatchedRange = (from: number, to: number) => {
        if (!Number.isFinite(from) || !Number.isFinite(to)) return;
        if (to < 0) return;

        const start = Math.floor(Math.max(0, from) / SEGMENT_SIZE);
        const end = Math.floor(Math.max(0, to) / SEGMENT_SIZE);

        for (let i = start; i <= end; i++) {
            if (i >= 0) watchedSegments.current.add(i);
        }
    };

    /** 영상 거의 끝났는지 체크 (마지막 9초) */
    const nearEnd = (v: HTMLVideoElement) =>
        v.duration > 0 && v.currentTime >= v.duration - 9;

    /** 🔢 LEAVE API payload 생성 */
    const buildLeavePayload = (
        v: HTMLVideoElement,
        hadEnd: boolean
    ) => {
        const segmentCount = Math.ceil(wholeTime / SEGMENT_SIZE);

        // 0/1 비트배열 생성
        const bits: string[] = [];
        for (let i = 0; i < segmentCount; i++) {
            bits.push(watchedSegments.current.has(i) ? "1" : "0");
        }
        const watch_segments = bits.join("");

        const watchedSeconds = watchedSegments.current.size * SEGMENT_SIZE;
        const rawRate = (watchedSeconds / wholeTime) * 100;
        const watch_rate = Math.min(100, Math.round(rawRate));

        return {
            session_id: sessionId,
            watch_rate,
            watch_segments,
            recent_position: v.currentTime || 0,
            is_quit: !hadEnd,
        };
    };

    /** 🚀 Beacon + axios 로 LEAVE 전송 */
    /** 🚀 Beacon + axios (fallback) LEAVE 전송 — 최종 버전 */
    const sendLeave = async (hadEnd: boolean, reason: string) => {
        const v = getVideoEl();
        if (!v) return;

        const payload = buildLeavePayload(v, hadEnd);

        console.log("📤 [LEAVE 전송 준비]", {
            reason,
            payload,
            watchedSegments: Array.from(watchedSegments.current),
        });

        const url = `${import.meta.env.VITE_API_BASE_URL}/${orgId}/video/${videoId}/leave`;

        // -----------------------------
        // 1) sendBeacon 우선 처리
        // -----------------------------
        let beaconSent = false;

        if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
            try {
                const blob = new Blob([JSON.stringify(payload)], {
                    type: "application/json",
                });
                beaconSent = navigator.sendBeacon(url, blob);

                console.log("📡 [Beacon 호출]", { beaconSent, url });
            } catch (err) {
                console.error("❌ [Beacon 전송 실패]", err);
            }
        }

        // -----------------------------
        // 2) Beacon 실패 → axios fallback
        // -----------------------------
        if (!beaconSent) {
            try {
                // pagehide 상황에서는 await 사용하면 안 됨!
                leaveVideoSession(orgId, videoId, payload)
                    .then(() => console.log("✅ [axios fallback 성공]"))
                    .catch((err) => console.error("❌ [axios fallback 실패]", err));
            } catch (_) { }
        } else {
            console.log("👌 Beacon 성공 → axios 생략");
        }
    };

    // =======================
    // 1) JOIN (초기 1회만)
    // =======================
    useEffect(() => {
        if (!joined.current) {
            joined.current = true;

            addEvent("JOIN", 0, {
                startedAt: startedAt.current,
                videoId,
                orgId,
                sessionId,
            });

            const v = getVideoEl();
            if (v) {
                lastPos.current = v.currentTime || 0;
            }

            console.log("🆔 [세션 시작]", {
                sessionId,
                orgId,
                videoId,
                startedAt: new Date(startedAt.current).toISOString(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId, videoId, orgId]);

    // =======================
    // 2) 1초마다 시청 커버리지 기록
    // =======================
    useEffect(() => {
        const timer = setInterval(() => {
            const v = getVideoEl();
            if (!v) return;

            // 영상 거의 끝났는데 아직 END 안보냈으면 여기서 한 번 더 체크
            if (!endedSent.current && nearEnd(v)) {
                console.log("🏁 [Loop near-end 감지] → onEnded 처리");

                endedSent.current = true;
                isPlaying.current = false;

                markWatchedRange(lastPos.current, v.duration || lastPos.current);
                lastPos.current = v.duration || lastPos.current;

                addEvent("END", v.duration || 0, { via: "loop-near-end" });

                void sendLeave(true, "loop-near-end");
                return;
            }

            // 재생 중 + 탐색 중이 아닐 때만 시청 구간 누적
            if (isPlaying.current && !isSeeking.current) {
                const now = v.currentTime || 0;
                const diff = Math.abs(now - lastPos.current);

                // 2초 이내의 변화만 "연속 시청"으로 판단
                if (diff > 0 && diff < 2) {
                    markWatchedRange(lastPos.current, now);
                }

                lastPos.current = now;
            }
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVideoEl]);

    // =======================
    // 3) 페이지 이탈 / 숨김 감지 (Beacon 사용)
    // =======================
    useEffect(() => {
        const handleLeave = (via: string) => {
            const v = getVideoEl();
            if (!v) return;

            // 이미 END 처리된 상태면 중복 LEAVE는 안 보냄
            if (endedSent.current) {
                return;
            }

            console.log(`🚪 [페이지 이탈 감지] via=${via}`);

            // 현재 위치까지 시청 구간 반영
            markWatchedRange(lastPos.current, v.currentTime || lastPos.current);
            lastPos.current = v.currentTime || lastPos.current;

            addEvent("LEAVE", v.currentTime || 0, { reason: via });

            // hadEnd=false → is_quit=true
            void sendLeave(false, via);
        };

        const onPageHide = () => handleLeave("pagehide");
        const onBeforeUnload = () => handleLeave("beforeunload");
        const onVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                handleLeave("visibilitychange");
            }
        };

        window.addEventListener("pagehide", onPageHide);
        window.addEventListener("beforeunload", onBeforeUnload);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", onPageHide);
            window.removeEventListener("beforeunload", onBeforeUnload);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVideoEl, orgId, videoId, sessionId]);

    // =======================
    // 4) 외부로 노출할 핸들러들
    // =======================
    const onPlay = () => {
        const v = getVideoEl();
        if (!v) return;

        isPlaying.current = true;
        lastPos.current = v.currentTime || 0;

        addEvent("PLAY", v.currentTime || 0);
        // console.log("▶️ [PLAY]", v.currentTime);
    };

    const onPause = () => {
        const v = getVideoEl();
        if (!v) return;

        // 영상 거의 끝난 상태의 pause는 END 직전일 수 있으므로 별도 처리 X
        if (!nearEnd(v)) {
            markWatchedRange(lastPos.current, v.currentTime || lastPos.current);
            lastPos.current = v.currentTime || lastPos.current;

            addEvent("PAUSE", v.currentTime || 0);
            // console.log("⏸ [PAUSE]", v.currentTime);
        }

        isPlaying.current = false;
    };

    const onSeeking = () => {
        isSeeking.current = true;
    };

    const onSeeked = () => {
        const v = getVideoEl();
        if (!v) return;

        isSeeking.current = false;
        lastPos.current = v.currentTime || 0;

        addEvent("SEEK", v.currentTime || 0);
        // console.log("⏩ [SEEK]", v.currentTime);
    };

    const onEnded = () => {
        const v = getVideoEl();
        if (!v) return;

        if (endedSent.current) {
            return;
        }

        endedSent.current = true;
        isPlaying.current = false;

        // 마지막 구간까지 시청한 것으로 처리
        markWatchedRange(lastPos.current, v.duration || lastPos.current);
        lastPos.current = v.duration || lastPos.current;

        addEvent("END", v.duration || 0, { via: "ended-event" });

        console.log("🏁 [END 이벤트 처리]", {
            duration: v.duration,
            watchedSegments: Array.from(watchedSegments.current),
        });

        // hadEnd=true → is_quit=false
        void sendLeave(true, "ended");
    };

    return {
        onPlay,
        onPause,
        onSeeking,
        onSeeked,
        onEnded,
    };
}