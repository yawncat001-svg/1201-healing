"use client";

// import { signIn } from "next-auth/react";
const signIn = (provider: string, opts?: any) => {
    alert("현재 인증 기능이 준비 중입니다. 잠시 후 다시 시도해주세요.");
    return Promise.resolve();
};
import BreathingCircle from "@/components/BreathingCircle";

export default function LoginPage() {
    return (
        <main className="h-screen w-screen bg-black flex flex-col items-center justify-center gap-12 text-white">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <h1 className="text-4xl font-display tracking-healing">12:01</h1>
                <p className="text-white/40 text-sm tracking-healing">
                    1201의 기억을 남기려면
                </p>
            </div>

            <div className="flex flex-col gap-4 w-64 animate-fade-in delay-1000">
                <button
                    onClick={() => signIn("kakao", { callbackUrl: "/space" })}
                    className="h-12 bg-[#FEE500] text-[#191919] rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    카카오로 시작하기
                </button>
                <button
                    onClick={() => signIn("google", { callbackUrl: "/space" })}
                    className="h-12 bg-white text-[#191919] rounded-full font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Google로 시작하기
                </button>
            </div>

            <div className="mt-8">
                <BreathingCircle
                    color="rgba(255, 255, 255, 0.2)"
                    size={40}
                    onClick={() => window.history.back()}
                    label="돌아가기"
                />
            </div>
        </main>
    );
}
