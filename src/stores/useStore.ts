import { create } from "zustand";
import { Mode } from "@/lib/modes";

interface HealingState {
    currentMode: Mode | null;
    setMode: (mode: Mode) => void;

    showUI: boolean;
    toggleUI: () => void;
    setShowUI: (show: boolean) => void;

    showClock: boolean;
    toggleClock: () => void;

    isWriting: boolean;
    setIsWriting: (writing: boolean) => void;

    volume: number;
    setVolume: (vol: number) => void;

    hasEntered: boolean;
    setHasEntered: (entered: boolean) => void;
}

export const useStore = create<HealingState>((set) => ({
    currentMode: null,
    setMode: (mode) => set({ currentMode: mode }),

    showUI: true,
    toggleUI: () => set((s) => ({ showUI: !s.showUI })),
    setShowUI: (show) => set({ showUI: show }),

    showClock: true,
    toggleClock: () => set((s) => ({ showClock: !s.showClock })),

    isWriting: false,
    setIsWriting: (writing) => set({ isWriting: writing }),

    volume: 0.5,
    setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),

    hasEntered: false,
    setHasEntered: (entered) => set({ hasEntered: entered }),
}));
