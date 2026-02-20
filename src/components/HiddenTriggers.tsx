"use client";

import { motion } from "framer-motion";

export default function HiddenTriggers() {
    // 화면 구석 등에 숨겨진 작은 트리거들
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="pointer-events-auto absolute bottom-10 right-10 w-2 h-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 2 }}
            />
            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="pointer-events-auto absolute top-10 left-10 w-2 h-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ scale: 2 }}
            />
        </div>
    );
}
