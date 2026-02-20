"use client";

import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BreathingCircle from "@/components/BreathingCircle";
import { ChevronLeft, X } from "lucide-react";

export default function WritingGardenPage() {
    const { isPremium, setShowPremiumModal } = useStore();
    const router = useRouter();
    const [writings, setWritings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWriting, setSelectedWriting] = useState<any>(null);

    useEffect(() => {
        if (!isPremium) {
            setShowPremiumModal(true);
            router.replace("/space");
            return;
        }

        const fetchWritings = async () => {
            try {
                const res = await fetch("/api/writings");
                const data = await res.json();
                setWritings(data);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWritings();
    }, [isPremium, router, setShowPremiumModal]);

    if (!isPremium) return null;

    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">

            <header className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between z-50 bg-linear-to-b from-black/80 to-transparent">
                <button onClick={() => router.back()} className="text-white/20 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-lg font-light tracking-[0.4em] uppercase">Writing Garden</h1>
                    <p className="text-[9px] text-white/30 mt-1 uppercase tracking-widest">Your starlit thoughts</p>
                </div>
                <div className="w-6" />
            </header>

            {isLoading ? (
                <div className="animate-pulse text-white/20 text-xs tracking-widest uppercase">Planting thoughts...</div>
            ) : writings.length === 0 ? (
                <div className="text-center space-y-4">
                    <p className="text-white/20 text-xs tracking-widest uppercase">The garden is empty</p>
                    <button
                        onClick={() => router.push("/space")}
                        className="text-[10px] text-white/40 border border-white/10 px-6 py-2 rounded-full hover:bg-white/5 transition-all"
                    >
                        Start writing
                    </button>
                </div>
            ) : (
                <div className="relative w-full h-[70vh] max-w-5xl">
                    {writings.map((writing: any, i: number) => {
                        // 랜덤 위치 (그리드 기반 분산)
                        const rows = 5;
                        const cols = 4;
                        const row = Math.floor(i / cols) % rows;
                        const col = i % cols;

                        const left = (col * 25) + 5 + (Math.random() * 10);
                        const top = (row * 20) + 5 + (Math.random() * 10);
                        const delay = i * 0.15;
                        const size = Math.min(Math.max((writing.content?.length || 0) * 0.4, 4), 16);

                        return (
                            <div
                                key={writing.id}
                                className="absolute group cursor-pointer"
                                style={{
                                    left: `${left}%`,
                                    top: `${top}%`,
                                    animation: `star-float 10s ease-in-out infinite alternate`,
                                    animationDelay: `${delay}s`
                                }}
                            >
                                <button
                                    onClick={() => setSelectedWriting(writing)}
                                    className="relative flex items-center justify-center focus:outline-none"
                                >
                                    <div
                                        className="rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-700 group-hover:scale-150 group-hover:shadow-[0_0_30px_rgba(255,255,255,1)]"
                                        style={{ width: size, height: size }}
                                    />

                                    {/* 호버 시 힌트 텍스트 */}
                                    <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap text-[8px] uppercase tracking-widest">
                                        View Thought
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <footer className="absolute bottom-12 flex flex-col items-center gap-4 z-50">
                <BreathingCircle
                    color="rgba(255, 255, 255, 0.15)"
                    size={48}
                    onClick={() => router.replace("/space")}
                    label="Back to Space"
                />
            </footer>

            {/* 상세 보기 오버레이 */}
            {selectedWriting && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-fade-in"
                    onClick={() => setSelectedWriting(null)}
                >
                    <button className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                        <X size={32} />
                    </button>

                    <div
                        className="max-w-xl w-full text-center space-y-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <time className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-display">
                            {new Date(selectedWriting.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <p className="text-2xl md:text-3xl font-light leading-relaxed break-keep">
                            {selectedWriting.content}
                        </p>
                        <div className="pt-12">
                            <div className="w-12 h-px bg-white/10 mx-auto mb-4" />
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">A piece of your soul</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
