// src/lib/db.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

/**
 * Cloudflare D1 데이터베이스 인스턴스를 가져옵니다.
 * 로컬 환경과 배포 환경(Edge) 모두를 대응합니다.
 */
export const getDB = () => {
    // Edge 선언 시점의 로직
    try {
        const { env } = getRequestContext() as any;
        return env.DB;
    } catch (e) {
        // 로컬 개발 환경 또는 getRequestContext를 지원하지 않는 경우의 폴백
        // 실제 환경에서는 wrangler dev를 통해 DB 바인딩이 제공됩니다.
        console.warn("DB 바인딩을 찾을 수 없습니다. 환경 설정을 확인하세요.");
        return null;
    }
};

/**
 * 유저의 구독 상태를 확인하는 헬퍼 함수
 */
export async function getSubscriptionStatus(userId: string) {
    const db = getDB();
    if (!db) return { plan: 'free', status: 'none' };

    try {
        const sub = await db
            .prepare("SELECT plan, status FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1")
            .bind(userId)
            .first();

        return sub || { plan: 'free', status: 'none' };
    } catch (error) {
        console.error("구독 정보 조회 에러:", error);
        return { plan: 'free', status: 'none' };
    }
}
