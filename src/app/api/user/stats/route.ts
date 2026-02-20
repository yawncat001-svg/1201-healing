export const runtime = "edge";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDB();
    if (!db) return NextResponse.json({ error: "DB not found" }, { status: 500 });

    try {
        const stats = await db.prepare(`
            SELECT 
                COUNT(*) as total_writings,
                SUM(LENGTH(content)) as total_characters,
                MAX(created_at) as last_writing
            FROM writings 
            WHERE user_id = ?
        `).bind(session.user.id).first();

        const subscription = await db.prepare(`
            SELECT plan, expires_at 
            FROM subscriptions 
            WHERE user_id = ? AND status = 'active'
        `).bind(session.user.id).first();

        return NextResponse.json({
            stats,
            subscription
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
