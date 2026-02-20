"use client";

import React from "react";

interface BreathingCircleProps {
    color?: string;
    size?: number;
    onClick?: () => void;
    label?: string;
    className?: string;
}

export default function BreathingCircle({
    color = "rgba(200, 182, 226, 0.6)",
    size = 64,
    onClick,
    label,
    className = "",
}: BreathingCircleProps) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center justify-center focus:outline-none cursor-pointer transition-transform active:scale-95 ${className}`}
            aria-label={label || "다음으로"}
        >
            {/* 바깥 글로우 — 느린 호흡 (CSS Animation) */}
            <div
                className="absolute rounded-full animate-breathe-glow"
                style={{
                    width: size * 1.6,
                    height: size * 1.6,
                    backgroundColor: color,
                    filter: "blur(20px)",
                }}
            />

            {/* 안쪽 원 — 4초 들숨 + 4초 날숨 (CSS Animation) */}
            <div
                className="relative rounded-full animate-breathe"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    backdropFilter: "blur(10px)",
                }}
            />
        </button>
    );
}
