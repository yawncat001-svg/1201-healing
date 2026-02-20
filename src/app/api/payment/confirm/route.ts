export const runtime = "edge";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function POST(request: Request) {
    const session = await auth();

    try {
        const { paymentKey, orderId, amount } = await request.json();

        // 토스페이먼츠 승인 API 호출 (서버 환경변수 비밀키 사용)
        const secretKey = process.env.TOSS_SECRET_KEY || "test_sk_py7McZdaRVE75M5nNG8V60YpW4Pr";
        // Node.js Buffer 대신 btoa 사용 (Edge 런타임 호환성)
        const basicToken = btoa(`${secretKey}:`);

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const db = getDB();
            if (db && session?.user) {
                const userId = session.user.id;
                const plan = orderId.includes("monthly") ? "monthly" : "yearly";
                const expiresAt = new Date();
                if (plan === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
                else expiresAt.setFullYear(expiresAt.getFullYear() + 1);

                await db.prepare(
                    "INSERT OR REPLACE INTO subscriptions (id, user_id, plan, status, toss_billing_key, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
                )
                    .bind(crypto.randomUUID(), userId, plan, 'active', paymentKey, expiresAt.toISOString())
                    .run();
            }

            console.log("결제 승인 성공:", data);
            return NextResponse.json({ success: true, data });
        } else {
            console.error("결제 승인 실패:", data);
            return NextResponse.json({ success: false, error: data.message }, { status: 400 });
        }
    } catch (error: any) {
        console.error("결제 API 에러:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
