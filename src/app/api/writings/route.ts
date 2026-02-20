import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const db = getDB();
        if (!db) {
            return NextResponse.json([]); // DB 없으면 빈 배열
        }

        const writings = await db
            .prepare("SELECT * FROM writings WHERE user_id = ? ORDER BY date DESC LIMIT 50")
            .bind(session.user.id)
            .all();

        return NextResponse.json(writings.results);
    } catch (error: any) {
        console.error("기록 조회 에러:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const { content } = await request.json();
        const db = getDB();

        if (!db) {
            // DB가 없는 경우 (로컬 테스트 등) 성공 응답만 보냄
            return NextResponse.json({ success: true, message: "Mock saved" });
        }

        const id = crypto.randomUUID();
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const userId = session.user.id;

        await db.prepare(
            "INSERT INTO writings (id, user_id, content, date, length) VALUES (?, ?, ?, ?, ?)"
        )
            .bind(id, userId, content, date, content.length)
            .run();

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("기록 저장 에러:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
