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

    // "시청 인정된" 구간 인덱스들 (payload 만들 때 채움)
    const watchedSegments = useRef<Set<number>>(new Set());

    // 각 구간별 누적 시청 시간(초) – 90% 기준 판정용
    const segmentWatchTime = useRef<number[]>([]);

    const joined = useRef(false);
    const isPlaying = useRef(false);
    const isSeeking = useRef(false);
    const endedSent = useRef(false);
    const lastPos = useRef(0);
    const startedAt = useRef(Date.now());
    const initialPathnameRef = useRef(window.location.pathname);

    const SEGMENT_SIZE = 10; // 10초 단위

    // ===== 구간별 시청 시간 배열 초기화 =====
    useEffect(() => {
        const segmentCount = Math.ceil(wholeTime / SEGMENT_SIZE);
        segmentWatchTime.current = Array(segmentCount).fill(0);
    }, [wholeTime]);

    /** 이벤트 버퍼에 기록 (디버깅/확장 대비) */
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
    };

    /**
     * from~to 사이 실제 시청 시간을 각 segment에 분배해서 누적
     * - 구간 단위: 10초
     * - 나중에 90% 이상 시청 여부 판정에 사용
     */
    const accumulateWatchTime = (from: number, to: number) => {
        if (!Number.isFinite(from) || !Number.isFinite(to)) return;
        if (to <= from) return;
        if (wholeTime <= 0) return;

        let start = Math.max(0, from);
        const end = Math.min(to, wholeTime);

        const segmentCount = segmentWatchTime.current.length;
        if (segmentCount === 0) return;

        while (start < end) {
            const segIndex = Math.floor(start / SEGMENT_SIZE);
            if (segIndex < 0 || segIndex >= segmentCount) break;

            const segStart = segIndex * SEGMENT_SIZE;
            const segEnd = Math.min(segStart + SEGMENT_SIZE, wholeTime, end);
            const delta = segEnd - start;

            if (delta > 0) {
                segmentWatchTime.current[segIndex] += delta;
            }

            start = segEnd;
        }
    };

    const safeNearEnd = (v: HTMLVideoElement) => {
        if (Date.now() - startedAt.current < 5000) return false;
        if (v.duration < 15) return false;
        return v.currentTime >= v.duration - 9;
    };

    /**
     * LEAVE API payload 생성
     * - 구간 10초 단위
     * - 각 구간 누적 시청시간이 "해당 구간 길이의 90% 이상"이면 시청 인정(1), 아니면 0
     */
    const buildLeavePayload = (v: HTMLVideoElement, hadEnd: boolean) => {
        const segmentCount =
            segmentWatchTime.current.length || Math.ceil(wholeTime / SEGMENT_SIZE);

        const bits: string[] = [];
        let watchedSeconds = 0;
        watchedSegments.current.clear();

        for (let i = 0; i < segmentCount; i++) {
            const segStart = i * SEGMENT_SIZE;
            // 마지막 구간은 실제 영상 길이에 맞춰서 길이 계산
            const segLen =
                i === segmentCount - 1
                    ? Math.max(0, wholeTime - segStart) || SEGMENT_SIZE
                    : SEGMENT_SIZE;

            const threshold = segLen * 0.9; // 90% 이상 시청해야 인정
            const watchedTime = segmentWatchTime.current[i] || 0;
            const isWatched = watchedTime >= threshold;

            if (isWatched) {
                watchedSegments.current.add(i);
                watchedSeconds += segLen;
                bits.push("1");
            } else {
                bits.push("0");
            }
        }

        const watch_segments = bits.join("");

        const rawRate =
            wholeTime > 0 ? (watchedSeconds / wholeTime) * 100 : 0;
        const watch_rate = Math.min(100, Math.round(rawRate));

        const recent = Math.floor(v.currentTime || 0);

        return {
            session_id: sessionId,
            watch_rate,
            watch_segments,
            recent_position: recent,
            is_quit: !hadEnd,
        };
    };

    /** Beacon + axios (fallback) LEAVE 전송 */
    const sendLeave = async (hadEnd: boolean, reason: string) => {
        const v = getVideoEl();
        if (!v) return;

        const payload = buildLeavePayload(v, hadEnd);

        console.log("[LEAVE 전송 준비]", {
            reason,
            payload,
            watchedSegments: Array.from(watchedSegments.current),
            segmentWatchTime: [...segmentWatchTime.current],
        });

        const url = `${import.meta.env.VITE_API_BASE_URL}/${orgId}/video/${videoId}/leave`;

        let beaconSent = false;

        // 1) sendBeacon 우선 시도
        if (
            typeof navigator !== "undefined" &&
            typeof navigator.sendBeacon === "function"
        ) {
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

        // 2) Beacon 실패 → axios fallback
        if (!beaconSent) {
            try {
                // pagehide 상황에서는 await 사용하지 않고 fire-and-forget
                leaveVideoSession(orgId, videoId, payload)
                    .then(() => console.log("✅ [axios fallback 성공]"))
                    .catch((err) => console.error("❌ [axios fallback 실패]", err));
            } catch {
                // 여기서 추가 처리 X
            }
        } else {
            console.log("Beacon 성공 → axios 생략");
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

            console.log("[세션 시작]", {
                sessionId,
                orgId,
                videoId,
                startedAt: new Date(startedAt.current).toISOString(),
            });
        }
    }, [sessionId, videoId, orgId]);

    // =======================
    // 2) 1초마다 시청 커버리지 기록
    // =======================
    useEffect(() => {
        const timer = setInterval(() => {
            const v = getVideoEl();
            if (!v) return;

            // 영상 거의 끝났는데 아직 END 안보냈으면 여기서 한 번 더 체크
            if (!endedSent.current && safeNearEnd(v)) {
                console.log("🏁 [Loop near-end 감지] → onEnded 처리");

                endedSent.current = true;
                isPlaying.current = false;

                // 마지막 위치까지 시청 시간 누적
                accumulateWatchTime(lastPos.current, v.duration || lastPos.current);
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
                if (diff > 0 && diff < 2.1) {
                    accumulateWatchTime(lastPos.current, now);
                }

                lastPos.current = now;
            }
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVideoEl]);

    // =======================
    // 3) 페이지 이탈 / 숨김 / 라우팅 변경 감지 (Beacon 강화)
    // =======================
    useEffect(() => {
        const initialPathname = initialPathnameRef.current;

        const handleLeave = (via: string, options?: { checkPath?: boolean }) => {
            const v = getVideoEl();
            if (!v) return;

            // 이미 END 처리된 상태면 중복 LEAVE는 안 보냄
            if (endedSent.current) return;

            const shouldCheckPath = options?.checkPath ?? true;

            // URL 기준으로만 이탈 처리하고 싶을 때
            if (shouldCheckPath && window.location.pathname === initialPathname) {
                return;
            }

            console.log(`🚪 [이탈 감지] via=${via}`);

            try {
                v.pause();
            } catch { }

            isPlaying.current = false;

            // 현재 위치까지 시청 시간 누적
            accumulateWatchTime(lastPos.current, v.currentTime || lastPos.current);
            lastPos.current = v.currentTime || lastPos.current;

            addEvent("LEAVE", v.currentTime || 0, { reason: via });

            // hadEnd=false → is_quit=true
            void sendLeave(false, via);
        };

        /** 1) 브라우저 뒤로가기/앞으로가기 (popstate) */
        const onPopState = () => {
            handleLeave("popstate", { checkPath: true });
        };

        /** 2) SPA pushState/replaceState 감지 (React Router 이동 포함) */
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function (
            data: any,
            unused: string,
            url?: string | URL | null,
        ) {
            const result = originalPushState.apply(history, [data, unused, url]);
            handleLeave("pushState", { checkPath: true });
            return result;
        } as History["pushState"];

        history.replaceState = function (
            data: any,
            unused: string,
            url?: string | URL | null,
        ) {
            const result = originalReplaceState.apply(history, [data, unused, url]);
            handleLeave("replaceState", { checkPath: true });
            return result;
        } as History["replaceState"];

        /** 3) <a href> 태그 클릭으로 외부/다른 페이지 이동 */
        const onDocumentClick = (e: any) => {
            const a = e.target.closest("a");
            if (!a) return;

            const url = a.getAttribute("href");
            if (!url) return;

            // 같은 페이지 anchor(#) 이동은 무시
            if (url.startsWith("#")) return;

            handleLeave("anchor-click", { checkPath: true });
        };

        /** 4) 브라우저 종료 / 새로고침 */
        const onBeforeUnload = () => handleLeave("beforeunload", { checkPath: false });
        const onPageHide = () => handleLeave("pagehide", { checkPath: false });

        /** 이벤트 등록 */
        window.addEventListener("pagehide", onPageHide);
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("popstate", onPopState);
        document.addEventListener("click", onDocumentClick, true);

        // ❌ visibilitychange는 더 이상 사용하지 않음 (탭 이동 제외)
        // document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", onPageHide);
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("popstate", onPopState);
            document.removeEventListener("click", onDocumentClick, true);

            // history 원복
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
        };
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
    };

    const onPause = () => {
        const v = getVideoEl();
        if (!v) return;

        // 영상 거의 끝난 상태의 pause는 END 직전일 수 있으므로 별도 처리 X
        if (!safeNearEnd(v)) {
            // 마지막으로 기록된 위치 ~ 현재 위치까지 시청시간 누적(살짝 보정)
            accumulateWatchTime(lastPos.current, v.currentTime || lastPos.current);
            lastPos.current = v.currentTime || lastPos.current;

            addEvent("PAUSE", v.currentTime || 0);
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
    };

    const onEnded = () => {
        const v = getVideoEl();
        if (!v) return;

        if (endedSent.current) {
            return;
        }

        endedSent.current = true;
        isPlaying.current = false;

        // 마지막 구간까지 시청 시간 누적
        accumulateWatchTime(lastPos.current, v.duration || lastPos.current);
        lastPos.current = v.duration || lastPos.current;

        addEvent("END", v.duration || 0, { via: "ended-event" });

        console.log("🏁 [END 이벤트 처리]", {
            duration: v.duration,
            watchedSegments: Array.from(watchedSegments.current),
            segmentWatchTime: [...segmentWatchTime.current],
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