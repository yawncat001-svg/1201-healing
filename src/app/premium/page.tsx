"use client";

import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import BreathingCircle from "@/components/BreathingCircle";
import { useRouter } from "next/navigation";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D53sO6W6YpW6LqLXV18rVGY0n3Bg";

export default function PremiumPage() {
    const [widgets, setWidgets] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
    const router = useRouter();

    useEffect(() => {
        async function init() {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const paymentWidgets = tossPayments.widgets({ customerKey: "ANONYMOUS" });
                setWidgets(paymentWidgets);
            } catch (err) {
                console.error("결제 위젯 로드 실패:", err);
            }
        }
        init();
    }, []);

    useEffect(() => {
        if (widgets) {
            const amount = selectedPlan === "monthly" ? 4900 : 39000;
            widgets.setAmount({ currency: "KRW", value: amount });
            widgets.renderPaymentMethods({ selector: "#payment-method" });
        }
    }, [widgets, selectedPlan]);

    const handlePayment = async () => {
        if (!widgets) return;
        try {
            await widgets.requestPayment({
                orderId: Math.random().toString(36).slice(2, 12),
                orderName: `1201 프리미엄 ${selectedPlan === "monthly" ? "월간" : "연간"} 구독`,
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
            });
        } catch (err) {
            console.error("결제 요청 실패:", err);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-8 flex flex-col items-center overflow-x-hidden">
            <header className="py-12 mt-8 text-center animate-fade-in">
                <h1 className="text-3xl font-light tracking-healing text-white">빛의 정원 입장권</h1>
                <p className="text-white/30 text-sm mt-4 tracking-healing">
                    당신이 머무는 공간을 더 깊고 풍성하게 만듭니다.
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl animate-fade-in delay-500">
                <PlanCard
                    active={selectedPlan === "monthly"}
                    onClick={() => setSelectedPlan("monthly")}
                    title="월간 구독" price="₩4,900" desc="가벼운 시작"
                />
                <PlanCard
                    active={selectedPlan === "yearly"}
                    onClick={() => setSelectedPlan("yearly")}
                    title="연간 구독" price="₩39,000" desc="월 3,250원"
                    badge="커피 한 잔 가격"
                />
            </div>

            <div id="payment-method" className="w-full max-w-2xl mt-12 bg-white/5 rounded-3xl p-4 animate-fade-in delay-1000" />

            <div className="mt-16 mb-24 flex flex-col items-center animate-fade-in delay-1500">
                <BreathingCircle
                    color="#A855F7"
                    size={56}
                    onClick={handlePayment}
                    label="결제하기"
                />
                <p className="text-center text-[10px] text-white/20 mt-6 tracking-healing">
                    안전한 토스페이먼츠 결제 시스템을 사용합니다.
                </p>
                <button
                    onClick={() => router.back()}
                    className="mt-8 text-white/20 text-xs hover:text-white/40 border-b border-transparent hover:border-white/20 transition-all"
                >
                    돌아가기
                </button>
            </div>
        </main>
    );
}

function PlanCard({ active, onClick, title, price, desc, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 p-8 rounded-[32px] border transition-all-slow text-left relative focus:outline-none ${active ? "bg-white/10 border-white/40 ring-1 ring-white/10" : "bg-white/5 border-white/5"}`}
        >
            {badge && (
                <span className="absolute -top-3 left-8 bg-purple-500 text-[10px] px-3 py-1 rounded-full font-medium text-white">
                    {badge}
                </span>
            )}
            <p className="text-xs text-white/40 tracking-healing uppercase">{title}</p>
            <p className="text-3xl font-light my-3 text-white">{price}</p>
            <p className="text-sm text-white/30 tracking-healing">{desc}</p>
        </button>
    );
}
