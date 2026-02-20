"use client";

import { useRouter, useSearchParams } from "next/navigation";
import BreathingCircle from "@/components/BreathingCircle";
import { Suspense } from "react";

function FailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || "알 수 없는 에러가 발생했습니다.";
    const code = searchParams.get("code");

    return (
        <main className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-8 text-white p-8 text-center">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <h1 className="text-3xl font-light tracking-healing text-red-400">결제에 실패했습니다</h1>
                <p className="text-white/40 text-sm tracking-healing max-w-xs">
                    {message} {code && `(코드: ${code})`}
                </p>
            </div>

            <div className="animate-fade-in delay-1000">
                <BreathingCircle
                    color="rgba(255, 255, 255, 0.2)"
                    size={56}
                    onClick={() => router.push("/premium")}
                    label="다시 시도"
                />
                <p className="text-center text-[10px] text-white/20 mt-6 tracking-healing">
                    다시 시도하거나 고객센터로 문의해주세요.
                </p>
            </div>
        </main>
    );
}

export default function PaymentFailPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
            <FailContent />
        </Suspense>
    );
}
