"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WritingSpace() {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full max-w-xl mx-auto mt-12 px-4">
            <div className={`relative transition-all duration-700 ${isFocused ? "opacity-100" : "opacity-40"}`}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="여기에 마음을 털어놓으세요..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white text-lg font-light resize-none h-32 placeholder:text-white/30 text-center"
                />
                <AnimatePresence>
                    {text && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 flex justify-center"
                        >
                            <button
                                onClick={() => setText("")}
                                className="text-white/40 hover:text-white text-xs tracking-tighter transition-colors"
                            >
                                비우기
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
