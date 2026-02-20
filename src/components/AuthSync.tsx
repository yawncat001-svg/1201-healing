"use client";

import { useEffect } from "react";
import { useStore } from "@/stores/useStore";
import { useSession } from "next-auth/react";

export default function AuthSync() {
    const { data: session } = useSession();
    const { setUser, setIsPremium, logout } = useStore();

    useEffect(() => {
        if (session?.user) {
            // 상세 상태(프리미엄 여부) API 호출
            const fetchStatus = async () => {
                try {
                    const res = await fetch("/api/user/status");
                    const data = await res.json();
                    if (data.isLoggedIn) {
                        setUser(data.user);
                        setIsPremium(data.isPremium);
                    }
                } catch (error) {
                    console.error("인증 상태 동기화 실패:", error);
                }
            };
            fetchStatus();
        } else {
            logout();
        }
    }, [session, setUser, setIsPremium, logout]);

    return null; // UI 없음
}
