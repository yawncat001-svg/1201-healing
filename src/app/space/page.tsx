"use client";
// src/app/space/page.tsx 상단 수정
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { modes } from "@/lib/modes";

export default function Space() {
    const { currentMode } = useStore();
    const router = useRouter();

    // 모드가 선택되지 않았으면 랜딩으로
    useEffect(() => {
        if (!currentMode) {
            router.push("/");
        }
    }, [currentMode, router]);

    if (!currentMode) return null;

    const mode = modes[currentMode];

    return (
        <main
            className={`relative h-screen w-screen flex items-center 
                  justify-center bg-gradient-to-b ${mode.gradient}`}
        >
            {/* STEP 2에서 VideoLoop, SoundPlayer 추가 예정 */}

            {/* 현재 시각 표시 */}
            <motion.div
                className="absolute bottom-8 right-8 text-white/30 
                   text-sm font-display tracking-healing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <Clock />
            </motion.div>

            {/* 모드 이름 — 진입 시 잠깐 표시 후 사라짐 */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 4, times: [0, 0.2, 0.7, 1] }}
            >
                <p className="text-white/60 text-lg tracking-healing">
                    {mode.nameKR}
                </p>
                <p className="text-white/30 text-xs tracking-healing mt-2">
                    {mode.subtitle}
                </p>
            </motion.div>
        </main>
    );
}

// 실시간 시계 컴포넌트
function Clock() {
    const { showClock } = useStore();

    // 실시간 현재 시각 — 매 초 업데이트
    const [time, setTime] = useState("");

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(
                `${String(now.getHours()).padStart(2, "0")}:${String(
                    now.getMinutes()
                ).padStart(2, "0")}`
            );
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!showClock) return null;

    return <span>{time}</span>;
}
