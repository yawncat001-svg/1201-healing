export const runtime = "edge";

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSubscriptionStatus } from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ isLoggedIn: false });
    }

    const sub = await getSubscriptionStatus(session.user.id);
    return NextResponse.json({
        isLoggedIn: true,
        user: session.user,
        isPremium: sub && sub.plan !== 'free' && sub.status === 'active'
    });
}
