"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreathingCircle from "@/components/BreathingCircle";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        if (paymentKey && orderId && amount) {
            const confirmPayment = async () => {
                try {
                    const res = await fetch("/api/payment/confirm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentKey, orderId, amount }),
                    });
                    if (res.ok) {
                        console.log("결제 승인 완료");
                    } else {
                        console.error("결제 승인 실패");
                        router.push("/payment/fail");
                    }
                } catch (error) {
                    console.error("결제 승인 중 오류:", error);
                }
            };
            confirmPayment();
        }
    }, [searchParams, router]);

    return (
        <main className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-8 text-white">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <h1 className="text-3xl font-light tracking-healing">환영합니다</h1>
                <p className="text-white/40 text-sm tracking-healing">
                    이제 1201의 모든 정원을 누릴 수 있습니다.
                </p>
            </div>

            <div className="animate-fade-in delay-1000">
                <BreathingCircle
                    color="#A855F7"
                    size={56}
                    onClick={() => router.push("/space")}
                    label="공간으로 이동"
                />
                <p className="text-center text-[10px] text-white/20 mt-6 tracking-healing">
                    당신의 공간이 확장되었습니다.
                </p>
            </div>
        </main>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
            <SuccessContent />
        </Suspense>
    );
}
