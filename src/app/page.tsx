"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BreathingCircle from "@/components/BreathingCircle";
import { modes, Mode } from "@/lib/modes";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";

export default function Landing() {
    const [phase, setPhase] = useState<"intro" | "select">("intro");
    const { setMode } = useStore();
    const router = useRouter();

    const handleEnter = () => {
        setPhase("select");
    };

    const handleModeSelect = (mode: Mode) => {
        setMode(mode);
        router.push("/space");
    };

    return (
        <main className="relative h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                {phase === "intro" && (
                    <motion.div
                        key="intro"
                        className="flex flex-col items-center gap-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                    >
                        {/* 12:01 타이포그래피 */}
                        <motion.h1
                            className="font-display text-6xl md:text-8xl
                         text-white/90 tracking-healing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 2, delay: 0.5 }}
                        >
                            12:01
                        </motion.h1>

                        {/* 서브카피 */}
                        <motion.p
                            className="text-white/50 text-sm md:text-base
                         tracking-healing leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, delay: 1.5 }}
                        >
                            당신이 당신에게 돌아오는 시간
                        </motion.p>

                        {/* 숨 쉬는 원 CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, delay: 2.5 }}
                        >
                            <BreathingCircle
                                color="rgba(255, 255, 255, 0.4)"
                                size={48}
                                onClick={handleEnter}
                                label="시작하기"
                            />
                        </motion.div>
                    </motion.div>
                )}

                {phase === "select" && (
                    <motion.div
                        key="select"
                        className="flex flex-col items-center gap-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.2 }}
                    >
                        {/* 질문 */}
                        <motion.p
                            className="text-white/40 text-sm tracking-healing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            오늘은 어떤 빛이 필요한가요
                        </motion.p>

                        {/* 3개 모드 선택 */}
                        <div className="flex gap-12 md:gap-20">
                            {(Object.keys(modes) as Mode[]).map((modeKey, i) => {
                                const mode = modes[modeKey];
                                return (
                                    <motion.div
                                        key={modeKey}
                                        className="flex flex-col items-center gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.3 }}
                                    >
                                        <BreathingCircle
                                            color={mode.circleColor}
                                            size={56}
                                            onClick={() => handleModeSelect(modeKey)}
                                            label={mode.nameKR}
                                        />
                                        <div className="text-center">
                                            <p className="text-white/70 text-xs tracking-healing">
                                                {mode.nameKR}
                                            </p>
                                            <p className="text-white/30 text-[10px]
                                    tracking-healing mt-1">
                                                {mode.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
