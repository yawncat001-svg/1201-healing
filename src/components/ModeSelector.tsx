"use client";

import { useStore } from "../stores/useStore";
import { modes, Mode } from "../lib/modes";

export default function ModeSelector() {
    const { currentMode, setMode } = useStore();

    return (
        <div className="flex gap-8 justify-center items-center py-6">
            {(Object.keys(modes) as Mode[]).map((modeKey) => {
                const mode = modes[modeKey];
                const isActive = currentMode === modeKey;

                return (
                    <button
                        key={modeKey}
                        onClick={() => setMode(modeKey)}
                        className="group relative px-4 py-2 flex flex-col items-center focus:outline-none"
                    >
                        <span
                            className={`text-sm tracking-widest transition-colors duration-500 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                                }`}
                        >
                            {mode.name}
                        </span>
                        {isActive && (
                            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white animate-fade-in" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
