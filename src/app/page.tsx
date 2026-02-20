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
        }, 1000);
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
        <main className={`hb-container ${isFading ? 'fade-out' : ''}`}>
            {/* ===== INTRO PHASE ===== */}
            {phase === "intro" && (
                <>
                    <h1 className="hb-title">12:01</h1>
                    <p className="hb-desc">당신이 당신에게 돌아오는 시간</p>
                    <div className="hb-circle-container">
                        <div className="hb-circle-glow" />
                        <button
                            onClick={handleEnter}
                            className="hb-button"
                            aria-label="Enter 12:01"
                        />
                    </div>
                </>
            )}

            {/* ===== SELECT PHASE ===== */}
            {phase === "select" && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', width: '100%', maxWidth: '800px', padding: '2rem' }}>
                    <p style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>
                        오늘은 어떤 빛이 필요한가요
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '3rem',
                        width: '100%',
                        maxHeight: '70vh',
                        overflowY: 'auto'
                    }}>
                        {(Object.keys(modes) as Mode[]).map((modeKey) => {
                            const mode = modes[modeKey];
                            const isLocked = mode.isPremium && !isPremium;

                            return (
                                <div
                                    key={modeKey}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                                    onClick={() => handleModeSelect(modeKey)}
                                >
                                    <div style={{ position: 'relative', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{
                                            position: 'absolute',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: mode.circleColor,
                                            filter: 'blur(15px)',
                                            opacity: 0.6
                                        }} />
                                        <div style={{
                                            position: 'relative',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: mode.circleColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            {isLocked && <Lock size={12} color="rgba(255,255,255,0.6)" />}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)' }}>{mode.nameKR}</p>
                                        <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: '0.3rem' }}>{mode.name}</p>
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
