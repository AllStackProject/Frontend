// src/api/Video/session.ts
// 서버 연동 전 목업 버전. 콘솔로 전송 내용 확인 가능.

export type StartSessionReq = { 
  sessionId: string;     // 클라이언트에서 생성한 세션 ID
  userId: number; 
  videoId: number; 
  orgId?: number; 
  startedAt?: number;
};

export type StartSessionRes = { 
  sessionId: string; 
};

export async function startSession(req: StartSessionReq): Promise<StartSessionRes> {
  console.log("📋 [MOCK - 콘솔만] /sessions/start", req);
  // 실제 API 호출 없음 - 즉시 반환
  return { sessionId: req.sessionId };
}

export type FlushSessionReq = {
  sessionId: string;
  endedAt: number;
  actualWatchSec: number;
  watchedSegCnt: number;
  hadEnd: boolean;
  recentPositionSec: number;
  durationSec: number;
};

export async function flushSession(body: FlushSessionReq): Promise<{ ok: true }> {
  console.log("📋 [MOCK - 콘솔만] /sessions/flush", {
    ...body,
    endedAtFormatted: new Date(body.endedAt).toISOString(),
  });
  // 실제 API 호출 없음 - 즉시 반환
  return { ok: true };
}