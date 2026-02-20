"use client";

import { useEffect, useRef } from "react";
import { useStore } from "../stores/useStore";
import { modes } from "../lib/modes";

export default function VideoLoop() {
    const { currentMode } = useStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const modeConfig = modes[currentMode];

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [currentMode]);

    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-black">
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute min-w-full min-h-full object-cover opacity-50 transition-opacity duration-1000"
            >
                <source src={modeConfig.video} type="video/mp4" />
            </video>
            <div
                className="absolute inset-0 transition-colors duration-1000"
                style={{ backgroundColor: modeConfig.primaryColor }}
            />
        </div>
    );
}
