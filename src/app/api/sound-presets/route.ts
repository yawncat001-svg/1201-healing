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
        if (!db) return NextResponse.json([]);

        const presets = await db
            .prepare("SELECT * FROM sound_presets WHERE user_id = ? ORDER BY created_at DESC")
            .bind(session.user.id)
            .all();

        return NextResponse.json(presets.results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const { name, settings } = await request.json();
        const db = getDB();
        if (!db) return NextResponse.json({ success: true });

        const id = crypto.randomUUID();
        await db.prepare(
            "INSERT INTO sound_presets (id, user_id, name, settings) VALUES (?, ?, ?, ?)"
        )
            .bind(id, session.user.id, name, JSON.stringify(settings))
            .run();

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
