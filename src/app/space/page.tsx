"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { modes, Mode } from "@/lib/modes";
import BreathingCircle from "@/components/BreathingCircle";
import PremiumModal from "@/components/PremiumModal";
import { MoreHorizontal, Music, Flower2, User, LogOut, LayoutGrid } from "lucide-react";
import { useSession, signOut as nextSignOut } from "next-auth/react";
import { getClipsByMode, VideoClip } from "@/lib/clips";
import { soundEngine, SOUND_LIBRARY } from "@/lib/sound-engine";

export default function Space() {
    const { data: session } = useSession();
    const {
        currentMode,
        volume,
        setVolume,
        showClock,
        toggleClock,
        isWriting,
        setIsWriting,
        showUI,
        setShowUI,
        isPremium,
        isLoggedIn,
        setUser,
        logout,
        setShowPremiumModal,
        soundLayers,
    } = useStore();
    const router = useRouter();

    const [time, setTime] = useState("");
    const [showModeIntro, setShowModeIntro] = useState(true);
    const [inputText, setInputText] = useState("");
    const [isFloating, setIsFloating] = useState(false);
    const [writingTriggerMsg, setWritingTriggerMsg] = useState(false);
    const [is1201, setIs1201] = useState(false);
    const [showMiniMenu, setShowMiniMenu] = useState(false);

    // 영상 시스템용 상태
    const [activeClips, setActiveClips] = useState<VideoClip[]>([]);
    const [currentClipIndex, setCurrentClipIndex] = useState(0);
    const [nextClipIndex, setNextClipIndex] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const writingIdleTimer = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 인증 상태 동기화
    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            });
        }
    }, [session, setUser]);

    // 리다이렉트 및 클립 로드
    useEffect(() => {
        if (!currentMode) {
            router.push("/");
            return;
        }
        const clips = getClipsByMode(currentMode);
        setActiveClips(clips);
        setCurrentClipIndex(0);
        setNextClipIndex(null);
    }, [currentMode, router]);

    // 사운드 엔진 초기화 및 레이어 재생
    useEffect(() => {
        const initEngine = async () => {
            if (soundEngine) {
                await soundEngine.init();
                // 정원 레이어 재생
                soundLayers.forEach((layer: any) => {
                    soundEngine.play(layer.sound, layer.volume * volume);
                });
            }
        };
        initEngine();
        return () => {
            // 엔진은 소리 정원과 공유되므로 여기서 dispose하진 않음
        };
    }, [soundLayers, volume]);

    // 마스터 볼륨 실시간 조절
    useEffect(() => {
        if (soundEngine) soundEngine.setMasterVolume(volume);
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    // 영상 자동 전환 시스템 (크로스페이드)
    useEffect(() => {
        if (activeClips.length <= 1) return;

        const currentClip = activeClips[currentClipIndex];
        // 클립 종료 2초 전에 전환 시작
        const timer = setTimeout(() => {
            setIsTransitioning(true);
            const nextIdx = (currentClipIndex + 1) % activeClips.length;
            setNextClipIndex(nextIdx);

            // 2초 크로스페이드 후 클립 인덱스 교체
            setTimeout(() => {
                setCurrentClipIndex(nextIdx);
                setNextClipIndex(null);
                setIsTransitioning(false);
            }, 2000);
        }, (currentClip.duration - 2) * 1000);

        return () => clearTimeout(timer);
    }, [currentClipIndex, activeClips]);

    // 시계 및 12:01 이스터에그
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            setTime(`${h}:${m}`);
            setIs1201(h === "12" && m === "01");
        };
        tick();
        const interval = setInterval(tick, 60000);
        return () => clearInterval(interval);
    }, []);

    // 글 흘려보내기
    const handleFlowAway = async () => {
        if (inputText.trim() === "") {
            setIsWriting(false);
            return;
        }

        if (isLoggedIn) {
            try {
                await fetch("/api/writings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: inputText }),
                });
            } catch (error) { }
        }

        setIsFloating(true);
        setTimeout(() => {
            setIsWriting(false);
            setIsFloating(false);
            setInputText("");
        }, 2500);
    };

    if (!currentMode) return null;
    const mode = modes[currentMode];

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">

            {/* 영상 레이어 (다중 클립 + 크로스페이드) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {activeClips.length > 0 ? (
                    <>
                        {/* 현재 클립 */}
                        <video
                            key={activeClips[currentClipIndex].id}
                            autoPlay
                            muted
                            loop={activeClips.length === 1}
                            playsInline
                            className={`h-full w-full object-cover transition-opacity duration-2000 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
                            style={{ filter: isWriting ? "blur(20px)" : "none" }}
                        >
                            <source src={activeClips[currentClipIndex].localPath} type="video/mp4" />
                        </video>

                        {/* 다음 클립 (미리 로딩 및 페이드인) */}
                        {nextClipIndex !== null && (
                            <video
                                key={activeClips[nextClipIndex].id}
                                autoPlay
                                muted
                                playsInline
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-2000 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
                                style={{ filter: isWriting ? "blur(20px)" : "none" }}
                            >
                                <source src={activeClips[nextClipIndex].localPath} type="video/mp4" />
                            </video>
                        )}
                    </>
                ) : (
                    /* 폴백: 단일 영상 */
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                        style={{ filter: isWriting ? "blur(20px)" : "none" }}
                    >
                        <source src={mode.videoSrc} type="video/mp4" />
                    </video>
                )}

                {/* 모드별 색보정 오버레이 (CSS Filter) */}
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        backdropFilter:
                            currentMode === 'dawn' ? "brightness(0.8) saturate(0.7) hue-rotate(-10deg)" :
                                currentMode === 'noon' ? "brightness(1.1) saturate(0.9) sepia(0.1)" :
                                    currentMode === 'dusk' ? "brightness(0.9) saturate(1.2) hue-rotate(15deg)" : "none"
                    }}
                />
            </div>

            {/* 배경 사운드 (기본) */}
            <audio ref={audioRef} autoPlay loop src={mode.soundSrc} />

            {/* UI 레이어 */}
            <div className={`relative z-20 h-full w-full flex flex-col items-center justify-between pb-12 pt-12 transition-all-slow ${showUI ? "opacity-100" : "opacity-0"}`}>
                <div />

                {isWriting ? (
                    <div className="flex flex-col items-center gap-8 w-full px-8">
                        <textarea
                            autoFocus
                            className={`writing-textarea transition-transform duration-1000 ${isFloating ? "animate-float-up" : ""}`}
                            placeholder=""
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <div className={isFloating ? "opacity-0 transition-opacity" : "animate-fade-in"}>
                            <BreathingCircle
                                color={mode.circleColor}
                                size={48}
                                onClick={handleFlowAway}
                                label="흘려보내기"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <BreathingCircle
                            color={mode.circleColor}
                            size={64}
                            onClick={() => setIsWriting(true)}
                            label="글쓰기 열기"
                        />
                    </div>
                )}

                <div className="flex flex-col items-center gap-6 w-full">
                    {!isWriting && (
                        <div className="flex flex-col items-center animate-fade-in delay-1000">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="volume-slider"
                            />
                        </div>
                    )}
                    <div className={`cursor-pointer transition-all-slow ${showClock ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={toggleClock}>
                        <span className="text-white/30 text-sm font-display tracking-healing">{time}</span>
                    </div>
                </div>
            </div>

            {/* 히든 메뉴 */}
            <div className={`absolute bottom-8 left-8 z-50 flex items-end gap-4 transition-all-slow ${showUI && !isWriting ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className={`flex flex-col gap-3 bg-black/60 backdrop-blur-md p-4 rounded-3xl transition-all-slow border border-white/10 ${showMiniMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    <button onClick={() => router.push("/")} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                        <LayoutGrid size={14} /> 테마 선택
                    </button>
                    <button onClick={() => !isPremium ? setShowPremiumModal(true) : router.push("/premium/sound-garden")} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                        <Music size={14} /> 소리 정원
                    </button>
                    <button onClick={() => !isPremium ? setShowPremiumModal(true) : router.push("/premium/writing-garden")} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors">
                        <Flower2 size={14} /> 기록 정원
                    </button>
                    <button onClick={() => router.push(isLoggedIn ? "/mypage" : "/login")} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors border-t border-white/5 pt-3 mt-1">
                        <User size={14} /> 마이페이지
                    </button>
                </div>
                <button onClick={() => setShowMiniMenu(!showMiniMenu)} className="text-white/20 hover:text-white/50 transition-colors p-2 text-2xl">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <PremiumModal />
        </main>
    );
}
