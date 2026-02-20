"use client";

import { useEffect, useRef } from "react";
import { useStore } from "../stores/useStore";
import { modes, Mode } from "../lib/modes";

export default function SoundPlayer() {
    const { currentMode, volume } = useStore();
    const audioRef = useRef<HTMLAudioElement>(null);
    const modeConfig = modes[currentMode as Mode];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.volume = volume;
            // 브라우저 정책상 사용자 상호작용 후 재생 가능하므로, 
            // 실제 구현시에는 첫 상호작용 후 play() 호출 필요
        }
    }, [currentMode, volume]);

    return (
        <audio ref={audioRef} loop>
            <source src={modeConfig.soundSrc} type="audio/mpeg" />
        </audio>
    );
}
