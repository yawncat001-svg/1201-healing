"use client";

export default function HiddenTriggers() {
    // 화면 구석 등에 숨겨진 작은 트리거들
    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
                className="pointer-events-auto absolute bottom-10 right-10 w-2 h-2 rounded-full bg-white/5 hover:bg-white/20 hover:scale-200 transition-all cursor-pointer"
            />
            <div
                className="pointer-events-auto absolute top-10 left-10 w-2 h-2 rounded-full bg-white/5 hover:bg-white/20 hover:scale-200 transition-all cursor-pointer"
            />
        </div>
    );
}
