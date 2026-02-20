"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { modes, Mode } from "@/lib/modes";
import { useStore } from "@/stores/useStore";
import PremiumModal from "@/components/PremiumModal";
import { Lock } from "lucide-react";

export default function Landing() {
    const [phase, setPhase] = useState<"intro" | "select">("intro");
    const [fading, setFading] = useState(false);
    const { setMode, isPremium, setShowPremiumModal } = useStore();
    const router = useRouter();

    const handleEnter = () => {
        setFading(true);
        setTimeout(() => {
            setPhase("select");
            setFading(false);
        }, 800);
    };

    const handleModeSelect = (modeKey: Mode) => {
        const mode = modes[modeKey];
        if (mode.isPremium && !isPremium) {
            setShowPremiumModal(true);
            return;
        }
        setMode(modeKey);
        router.push("/space");
    };

    return (
        <main className="relative h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* ===== INTRO PHASE ===== */}
            {phase === "intro" && (
                <div
                    className={`flex flex-col items-center gap-12 transition-opacity duration-800 ${fading ? "opacity-0" : "opacity-100"}`}
                >
                    <h1 className="text-7xl md:text-9xl text-white/90 font-extralight tracking-widest hb-animate-fade-in hb-delay-500">
                        12:01
                    </h1>
                    <p className="text-sm md:text-base text-white/50 tracking-widest hb-animate-fade-in hb-delay-1500">
                        당신이 당신에게 돌아오는 시간
                    </p>
                    <div className="relative flex items-center justify-center w-24 h-24 hb-animate-fade-in hb-delay-2500">
                        <div className="absolute w-20 h-20 rounded-full bg-white/40 blur-2xl hb-animate-breathe-glow" />
                        <button
                            onClick={handleEnter}
                            className="relative w-12 h-12 rounded-full bg-white/40 z-10 hb-animate-breathe cursor-pointer border-none"
                        />
                    </div>
                </div>
            )}

            {/* ===== SELECT PHASE ===== */}
            {phase === "select" && (
                <div className="flex flex-col items-center gap-16 px-8 max-w-4xl w-full">
                    <p className="text-sm text-white/40 tracking-widest hb-animate-fade-in hb-delay-500">
                        오늘은 어떤 빛이 필요한가요
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 hb-animate-fade-in hb-delay-1000 overflow-y-auto max-h-[70vh] py-8 no-scrollbar">
                        {(Object.keys(modes) as Mode[]).map((modeKey, i) => {
                            const mode = modes[modeKey];
                            const isLocked = mode.isPremium && !isPremium;

                            return (
                                <div
                                    key={modeKey}
                                    className="flex flex-col items-center gap-4 group cursor-pointer"
                                    onClick={() => handleModeSelect(modeKey)}
                                >
                                    {/* 모드 원 */}
                                    <div className="relative flex items-center justify-center w-20 h-20">
                                        <div
                                            className="absolute w-16 h-16 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity hb-animate-breathe-glow"
                                            style={{ backgroundColor: mode.circleColor }}
                                        />
                                        <div
                                            className="relative w-12 h-12 rounded-full z-10 hb-animate-breathe flex items-center justify-center overflow-hidden"
                                            style={{ backgroundColor: mode.circleColor }}
                                        >
                                            {isLocked && (
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                                    <Lock size={12} className="text-white/60" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 라벨 */}
                                    <div className="text-center">
                                        <p className="text-xs text-white/70 tracking-widest leading-none">
                                            {mode.nameKR}
                                        </p>
                                        <p className="text-[9px] text-white/30 tracking-widest mt-2 uppercase">
                                            {mode.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <PremiumModal />
        </main>
    );
}
