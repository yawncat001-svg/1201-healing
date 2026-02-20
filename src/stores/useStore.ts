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

    // 인증 및 프리미엄
    user: { id: string; name: string; email: string; image?: string } | null;
    isLoggedIn: boolean;
    isPremium: boolean;
    setUser: (user: any) => void;
    setIsPremium: (premium: boolean) => void;
    logout: () => void;

    showPremiumModal: boolean;
    setShowPremiumModal: (show: boolean) => void;

    soundLayers: { id: string; sound: string; volume: number }[];
    setSoundLayers: (layers: any[]) => void;
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

    // STEP 3 초기값
    user: null,
    isLoggedIn: false,
    isPremium: false,
    setUser: (user) => set({ user, isLoggedIn: !!user }),
    setIsPremium: (premium) => set({ isPremium: premium }),
    logout: () => set({ user: null, isLoggedIn: false, isPremium: false }),

    showPremiumModal: false,
    setShowPremiumModal: (show) => set({ showPremiumModal: show }),

    soundLayers: [
        { id: "1", sound: "rain", volume: 0.5 },
        { id: "2", sound: "birds", volume: 0.3 }
    ],
    setSoundLayers: (layers) => set({ soundLayers: layers }),
}));
