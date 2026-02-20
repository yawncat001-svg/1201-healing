"use client";

import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import BreathingCircle from "@/components/BreathingCircle";
import { soundEngine, SOUND_LIBRARY, TINNITUS_PRESETS, SoundChannel } from "@/lib/sound-engine";
import { Volume2, X, Bookmark, Save, ChevronLeft, Power, Sparkles } from "lucide-react";

export default function SoundGardenPage() {
    const { isPremium, setShowPremiumModal, soundLayers, setSoundLayers } = useStore();
    const router = useRouter();
    const [presets, setPresets] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [masterVol, setMasterVol] = useState(1);
    const [activeLayers, setActiveLayers] = useState<string[]>([]);

    useEffect(() => {
        if (!isPremium) {
            setShowPremiumModal(true);
            router.replace("/space");
            return;
        }

        const fetchPresets = async () => {
            try {
                const res = await fetch("/api/sound-presets");
                const data = await res.json();
                setPresets(data);
            } catch (error) {
                console.error("프리셋 로드 실패:", error);
            }
        };
        fetchPresets();

        return () => {
            // 페이지 벗어날 때 엔진 정리는 하지 않음 (연속성 유지)
            // 다만 여기서만 쓰는 특정 설정이 있다면 정리
        };
    }, [isPremium, router, setShowPremiumModal]);

    // 엔진 상태와 로컬 상태 동기화
    useEffect(() => {
        if (soundEngine) {
            setActiveLayers(soundLayers.map((l: any) => l.sound));
            soundLayers.forEach((layer: any) => {
                soundEngine.play(layer.sound, layer.volume);
            });
        }
    }, [soundLayers]);

    if (!isPremium) return null;

    const toggleSound = async (channelId: string) => {
        if (!soundEngine) return;

        const isActive = activeLayers.includes(channelId);
        if (isActive) {
            soundEngine.stop(channelId);
            setSoundLayers(soundLayers.filter((l: any) => l.sound !== channelId));
        } else {
            const channel = SOUND_LIBRARY.find((s: any) => s.id === channelId);
            if (channel) {
                await soundEngine.play(channelId, channel.defaultVolume);
                setSoundLayers([...soundLayers, { id: crypto.randomUUID(), sound: channelId, volume: channel.defaultVolume }]);
            }
        }
    };

    const updateVolume = (soundId: string, vol: number) => {
        if (soundEngine) {
            soundEngine.setVolume(soundId, vol);
            setSoundLayers(soundLayers.map((l: any) => l.sound === soundId ? { ...l, volume: vol } : l));
        }
    };

    const applyTinnitusPreset = async (preset: any) => {
        if (soundEngine) {
            await soundEngine.applyPreset(preset);
            setSoundLayers(preset.layers.map((l: any) => ({ ...l, sound: l.id })));
        }
    };

    const handleSavePreset = async () => {
        if (soundLayers.length === 0) return;
        const name = prompt("프리셋 이름을 입력하세요", `나만의 조합 ${new Date().toLocaleDateString()}`);
        if (!name) return;

        setIsSaving(true);
        try {
            const res = await fetch("/api/sound-presets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, settings: soundLayers }),
            });
            if (res.ok) {
                const newPreset = await res.json();
                setPresets([{ id: newPreset.id, name, settings: JSON.stringify(soundLayers) }, ...presets]);
            }
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12">
            <header className="fixed top-0 left-0 right-0 p-6 md:p-12 flex items-center justify-between z-50 bg-linear-to-b from-black to-transparent">
                <button onClick={() => router.back()} className="text-white/20 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-light tracking-[0.3em] uppercase">Sound Garden</h1>
                    <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">Multi-Channel Mixing</p>
                </div>
                <button onClick={handleSavePreset} disabled={isSaving || soundLayers.length === 0} className="text-white/20 hover:text-white transition-colors">
                    <Save size={20} />
                </button>
            </header>

            <div className="max-w-4xl mx-auto pt-28 pb-40 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* 왼쪽: 컨트롤러 */}
                <div className="space-y-12">
                    {/* 카테고리별 그룹 */}
                    {(['nature', 'ambient', 'masking'] as const).map(category => (
                        <section key={category} className="space-y-6">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
                                {category === 'nature' ? 'Natural Sounds' : category === 'ambient' ? 'Ambient Atmosphere' : 'Tinnitus Masking'}
                            </h2>
                            <div className="grid grid-cols-1 gap-2">
                                {SOUND_LIBRARY.filter((s: any) => s.category === category).map((sound: any) => {
                                    const isActive = activeLayers.includes(sound.id);
                                    const layer = soundLayers.find((l: any) => l.sound === sound.id);

                                    return (
                                        <div key={sound.id} className={`p-4 rounded-3xl border transition-all ${isActive ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent opacity-40 hover:opacity-100"}`}>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleSound(sound.id)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/5 text-white/40"}`}
                                                >
                                                    <span className="text-lg">{sound.icon}</span>
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-light tracking-wide">{sound.nameKR}</span>
                                                        {isActive && <span className="text-[9px] text-white/30 uppercase">{Math.round((layer?.volume || 0) * 100)}%</span>}
                                                    </div>
                                                    {isActive && (
                                                        <input
                                                            type="range"
                                                            min="0" max="1" step="0.01"
                                                            value={layer?.volume || 0}
                                                            onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                                                            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* 오른쪽: 프리셋 및 시각화 */}
                <div className="space-y-12">
                    <section className="space-y-6">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium flex items-center gap-2">
                            <Sparkles size={12} /> Tinnitus Relief Presets
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {TINNITUS_PRESETS.map((p: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => applyTinnitusPreset(p)}
                                    className="p-6 bg-linear-to-br from-white/10 to-transparent border border-white/5 rounded-3xl text-left hover:border-white/20 transition-all group"
                                >
                                    <h3 className="text-sm font-light mb-1">{p.nameKR}</h3>
                                    <p className="text-[10px] text-white/30">{p.name}</p>
                                    <div className="mt-4 flex gap-1">
                                        {p.layers.map((l: any) => (
                                            <div key={l.id} className="w-1 h-4 bg-white/10 rounded-full overflow-hidden">
                                                <div className="w-full bg-white/40" style={{ height: `${l.volume * 100}%`, marginTop: `${(1 - l.volume) * 100}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {presets.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">My Mixes</h2>
                            <div className="grid grid-cols-1 gap-2">
                                {presets.map((p: any) => (
                                    <button
                                        key={p.id}
                                        onClick={() => {
                                            const settings = JSON.parse(p.settings);
                                            setSoundLayers(settings);
                                        }}
                                        className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Bookmark size={12} className="text-white/20" />
                                            <span className="text-xs font-light text-white/60 group-hover:text-white transition-colors">{p.name}</span>
                                        </div>
                                        <div className="text-[8px] uppercase tracking-tighter text-white/10 group-hover:text-white/40">Load</div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <footer className="fixed bottom-12 left-0 right-0 flex flex-col items-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <BreathingCircle
                        color="rgba(168, 85, 247, 0.4)"
                        size={64}
                        onClick={() => router.push("/space")}
                        label="정원 나가기"
                    />
                </div>
            </footer>
        </main>
    );
}
