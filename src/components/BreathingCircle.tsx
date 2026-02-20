"use client";

import { motion } from "framer-motion";

interface BreathingCircleProps {
    color?: string;
    size?: number;
    onClick?: () => void;
    label?: string;
}

export default function BreathingCircle({
    color = "rgba(200, 182, 226, 0.6)",
    size = 64,
    onClick,
    label,
}: BreathingCircleProps) {
    return (
        <motion.button
            onClick={onClick}
            className="relative flex items-center justify-center focus:outline-none"
            whileTap={{ scale: 0.95 }}
            aria-label={label || "다음으로"}
        >
            {/* 바깥 글로우 — 느린 호흡 */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: size * 1.6,
                    height: size * 1.6,
                    backgroundColor: color,
                    filter: "blur(20px)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* 안쪽 원 — 4초 들숨 + 4초 날숨 */}
            <motion.div
                className="relative rounded-full cursor-pointer"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    backdropFilter: "blur(10px)",
                }}
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.button>
    );
}
