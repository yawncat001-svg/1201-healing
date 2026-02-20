"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { modes, Mode } from "@/lib/modes";
import BreathingCircle from "@/components/BreathingCircle";
import PremiumModal from "@/components/PremiumModal";
import { MoreHorizontal, Music, Flower2, User, LogOut, LayoutGrid } from "lucide-react";
// import { useSession, signOut as nextSignOut } from "next-auth/react";
import { getClipsByMode, VideoClip } from "@/lib/clips";
import { soundEngine, SOUND_LIBRARY } from "@/lib/sound-engine";

const useSession = () => ({ data: null, status: "unauthenticated" });
const nextSignOut = () => Promise.resolve();

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

    // 인증 상태 동기화 (비활성화 상태)
    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: (session.user as any).image,
            });
        }
    }, [session, setUser]);

    // 시간 업데이트 로직
    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, "0");
            const m = now.getMinutes().toString().padStart(2, "0");
            setTime(`${h}:${m}`);
            setIs1201(h === "12" && m === "01");
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    // 영상 시퀀스 제어
    useEffect(() => {
        if (!currentMode) return;
        const clips = getClipsByMode(currentMode);
        setActiveClips(clips);
        setCurrentClipIndex(0);
        setNextClipIndex(null);
    }, [currentMode]);

    // 사운드 엔진 볼륨 조절
    useEffect(() => {
        soundEngine.setMasterVolume(volume);
    }, [volume]);

    // 사운드 레이어 동기화
    useEffect(() => {
        if (soundLayers.length > 0) {
            soundLayers.forEach((layer: any) => {
                soundEngine.play(layer.sound, layer.volume);
            });
        }
        return () => {
            soundLayers.forEach((layer: any) => {
                soundEngine.stop(layer.sound);
            });
        };
    }, [soundLayers]);

    const handleModeSelect = (modeKey: Mode) => {
        const mode = modes[modeKey];
        if (mode.isPremium && !isPremium) {
            setShowPremiumModal(true);
            return;
        }
        router.push(`/space?mode=${modeKey}`);
    };

    const handleLogout = async () => {
        await nextSignOut();
        logout();
        router.push("/");
    };

    const handleWritingSubmit = async () => {
        if (!inputText.trim()) return;

        // DB 저장 로직 (선택 사항)
        if (isLoggedIn) {
            try {
                await fetch("/api/writings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: inputText, mode: currentMode }),
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

                {/* 컬러 그레이딩 오버레이 */}
                <div
                    className="absolute inset-0 pointer-events-none transition-colors duration-1000"
                    style={{
                        backgroundColor: mode.accentColor,
                        opacity: isWriting ? 0.4 : 0.15
                    }}
                />
            </div>

            {/* 시계 및 UI */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-1000 ${showUI ? "opacity-100" : "opacity-0"}`}>
                {showClock && !isWriting && (
                    <h1 className={`text-8xl font-thin tracking-widest transition-all duration-1000 ${is1201 ? "text-purple-300 drop-shadow-glow" : "text-white/80"}`}>
                        {time}
                    </h1>
                )}

                {/* 기록 공간 */}
                {isWriting && (
                    <div className="w-full max-w-2xl px-8 flex flex-col items-center animate-fade-in">
                        <textarea
                            autoFocus
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="지금 이 순간의 마음을 적어보세요..."
                            className="w-full bg-transparent border-none text-center text-2xl font-light placeholder:text-white/20 focus:ring-0 resize-none h-48 transition-all"
                        />
                        <div className="mt-12">
                            <BreathingCircle
                                color={mode.accentColor}
                                size={64}
                                onClick={handleWritingSubmit}
                                label="보내기"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* 좌하단 히든 메뉴 */}
            <div className={`absolute bottom-8 left-8 z-50 flex items-end gap-4 transition-all-slow ${showUI && !isWriting ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className={`flex flex-col gap-3 bg-black/60 backdrop-blur-md p-4 rounded-3xl transition-all-slow border border-white/10 ${showMiniMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    <button
                        onClick={() => !isPremium ? setShowPremiumModal(true) : router.push("/premium/sound-garden")}
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        <Music size={14} /> 소리 정원
                    </button>
                    <button
                        onClick={() => !isPremium ? setShowPremiumModal(true) : router.push("/premium/writing-garden")}
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        <Flower2 size={14} /> 기록 정원
                    </button>
                    <div className="h-[1px] bg-white/10 my-1" />
                    <button
                        onClick={() => router.push("/mypage")}
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        <User size={14} /> 마이페이지
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
                    >
                        <LogOut size={14} /> 로그아웃
                    </button>
                </div>
                <button
                    onClick={() => setShowMiniMenu(!showMiniMenu)}
                    className="p-3 bg-black/40 hover:bg-black/60 rounded-full transition-all border border-white/5 text-white/40 hover:text-white"
                >
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* 기록 시작 트리거 (화면 하단 중앙) */}
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-700 ${showUI && !isWriting ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <button
                    onClick={() => setIsWriting(true)}
                    className="text-[10px] tracking-[0.3em] text-white/20 hover:text-white/60 transition-all uppercase"
                >
                    Write your heart
                </button>
            </div>

            {/* 떠오르는 글자 애니메이션 */}
            {isFloating && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <p className="text-xl font-light text-white animate-float-up opacity-0">
                        {inputText}
                    </p>
                </div>
            )}

            <PremiumModal />
        </main>
    );
}
