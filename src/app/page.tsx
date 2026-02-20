"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { modes, Mode } from "@/lib/modes";
import { useStore } from "@/stores/useStore";
import PremiumModal from "@/components/PremiumModal";
import { Lock } from "lucide-react";

export default function Landing() {
    const [phase, setPhase] = useState<"intro" | "select">("intro");
    const [isFading, setIsFading] = useState(false);
    const { setMode, isPremium, setShowPremiumModal } = useStore();
    const router = useRouter();

    const handleEnter = () => {
        setIsFading(true);
        setTimeout(() => {
            setPhase("select");
            setIsFading(false);
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
        <main className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4 transition-opacity duration-700" style={{ opacity: isFading ? 0 : 1 }}>
            {/* ===== intro phase ===== */}
            {phase === "intro" && (
                <div className="flex flex-col items-center text-center">
                    <h1 className="animate-fade-in text-6xl font-extralight tracking-[0.3em] text-white/90 md:text-8xl" style={{ animationDelay: '0.2s' }}>
                        12:01
                    </h1>
                    <p className="animate-fade-in mt-6 text-sm tracking-[0.2em] text-white/50 md:text-base" style={{ animationDelay: '0.8s' }}>
                        당신이 당신에게 돌아오는 시간
                    </p>
                    <div className="animate-fade-in mt-16 flex items-center justify-center" style={{ animationDelay: '1.4s' }}>
                        <button
                            onClick={handleEnter}
                            className="animate-breathe h-12 w-12 cursor-pointer rounded-full bg-white/30 border-none transition-transform hover:scale-110 active:scale-95"
                            aria-label="Enter"
                        />
                    </div>
                </div>
            )}

            {/* ===== select phase ===== */}
            {phase === "select" && (
                <div className="animate-fade-in flex w-full max-w-4xl flex-col items-center gap-12 py-12">
                    <p className="text-sm tracking-widest text-white/40">오늘은 어떤 빛이 필요한가요</p>

                    <div className="no-scrollbar grid w-full grid-cols-2 gap-8 overflow-y-auto px-4 md:grid-cols-4 md:gap-12">
                        {(Object.keys(modes) as Mode[]).map((modeKey) => {
                            const mode = modes[modeKey];
                            const isLocked = mode.isPremium && !isPremium;

                            return (
                                <div
                                    key={modeKey}
                                    className="group flex cursor-pointer flex-col items-center gap-4 transition-transform hover:scale-105"
                                    onClick={() => handleModeSelect(modeKey)}
                                >
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: mode.circleColor }}>
                                        <div className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" style={{ backgroundColor: mode.circleColor }} />
                                        {isLocked && <Lock size={14} className="relative z-10 text-white/60" />}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs tracking-wider text-white/80">{mode.nameKR}</p>
                                        <p className="mt-1 text-[10px] uppercase tracking-tighter text-white/30">{mode.name}</p>
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
