// src/api/Video/event.ts
// 비디오 시청 이벤트 전송 API

export type VideoEvent = {
  type: "JOIN" | "PLAY" | "PAUSE" | "SEEK" | "END" | "LEAVE";
  position: number;      // 초
  timestamp: number;     // epoch ms
  metadata?: Record<string, any>;
};

export type SendEventsReq = {
  sessionId: string;
  events: VideoEvent[];
};

export type SendEventsRes = {
  ok: boolean;
  recorded: number;  // 기록된 이벤트 수
};

export async function sendVideoEvents(req: SendEventsReq): Promise<SendEventsRes> {
  console.log("📋 [MOCK - 콘솔만] /sessions/events", {
    sessionId: req.sessionId,
    eventCount: req.events.length,
  });
  
  console.log("📝 [이벤트 상세]");
  req.events.forEach((event, idx) => {
    const time = new Date(event.timestamp).toLocaleTimeString('ko-KR');
    console.log(`  [${idx + 1}] ${event.type.padEnd(6)} @ ${event.position.toFixed(2).padStart(7)}초 (${time})`, 
      event.metadata ? event.metadata : ''
    );
  });
  
  // 실제 API 호출 없음 - 즉시 반환
  return { 
    ok: true,
    recorded: req.events.length
  };
}