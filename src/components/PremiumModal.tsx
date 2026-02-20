"use client";

import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";

export default function PremiumModal() {
    const { showPremiumModal, setShowPremiumModal } = useStore();
    const router = useRouter();

    if (!showPremiumModal) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="w-[320px] bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-8 text-center">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-light tracking-healing">
                        1201의 모든 빛을 만나보세요
                    </h2>
                    <p className="text-white/40 text-xs leading-relaxed">
                        무제한 풍경 테마, 소리 정원 믹싱,<br />
                        그리고 당신의 기록 꽃밭을 가꾸어보세요.
                    </p>
                </div>

                <div className="flex flex-col gap-2 w-full text-sm">
                    <div className="p-3 bg-white/5 rounded-xl flex justify-between">
                        <span className="text-white/60">월간 구독</span>
                        <span>₩4,900</span>
                    </div>
                    <div className="p-3 bg-white/10 rounded-xl flex justify-between border border-white/20 relative">
                        <span className="text-white/80">연간 구독</span>
                        <span>₩39,000</span>
                        <span className="absolute -top-2 -right-2 bg-purple-500 text-[10px] px-2 py-0.5 rounded-full">Best</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full pt-4">
                    <button
                        onClick={() => {
                            setShowPremiumModal(false);
                            router.push("/premium");
                        }}
                        className="h-12 bg-white text-black rounded-full font-medium transition-transform active:scale-95"
                    >
                        프리미엄 시작하기
                    </button>
                    <button
                        onClick={() => setShowPremiumModal(false)}
                        className="text-white/30 text-xs hover:text-white/60 px-4 py-2"
                    >
                        괜찮아요
                    </button>
                </div>
            </div>
        </div>
    );
}
