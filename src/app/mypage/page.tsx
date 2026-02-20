"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { ChevronLeft, LogOut, Award, BarChart2, Calendar, CreditCard } from "lucide-react";

// import { signOut } from "next-auth/react";
const signOut = (opts?: any) => Promise.resolve();

export default function MyPage() {
    const { user, isLoggedIn, isPremium, logout } = useStore();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            router.replace("/");
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats");
                const data = await res.json();
                setStats(data);
            } catch (e) {
                console.error("Stats fetching failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [isLoggedIn, router]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        logout();
        router.push("/");
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12">
            <header className="flex items-center justify-between mb-12">
                <button onClick={() => router.back()} className="text-white/30 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-sm uppercase tracking-[0.3em] font-light">My Page</h1>
                <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </header>

            <div className="max-w-xl mx-auto space-y-8">
                {/* Profile Header */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border border-white/20">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-white/10 flex items-center justify-center text-xl">
                                {user.name?.[0]}
                            </div>
                        )}
                    </div>
                    <h2 className="text-lg font-light">{user.name}</h2>
                    <p className="text-white/30 text-xs mt-1">{user.email}</p>

                    <div className="mt-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10">
                        <Award size={14} className={isPremium ? "text-amber-400" : "text-white/30"} />
                        <span className="text-[10px] uppercase tracking-widest font-medium">
                            {isPremium ? "Premium Member" : "Free Member"}
                        </span>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-white/30 mb-2">
                            <BarChart2 size={14} />
                            <span className="text-[10px] uppercase tracking-widest">Total Writings</span>
                        </div>
                        <p className="text-xl font-light">{stats?.stats?.total_writings || 0}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-2 text-white/30 mb-2">
                            <Calendar size={14} />
                            <span className="text-[10px] uppercase tracking-widest">Characters</span>
                        </div>
                        <p className="text-xl font-light">{stats?.stats?.total_characters || 0}</p>
                    </div>
                </section>

                {/* Subscription Card */}
                <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xs uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                        <CreditCard size={14} /> Subscription Status
                    </h3>

                    {isPremium ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-medium">{stats?.subscription?.plan === 'monthly' ? '월간 구독' : '연간 구독'}</p>
                                    <p className="text-[10px] text-white/40 mt-1">
                                        만료일: {stats?.subscription?.expires_at ? new Date(stats?.subscription?.expires_at).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <span className="text-[10px] text-green-400 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-white/60 mb-4">프리미엄 회원이 되어 모든 기능을 무제한으로 즐겨보세요.</p>
                            <button
                                onClick={() => router.push("/premium")}
                                className="w-full py-3 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-xl"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    )}
                </section>

                <p className="text-center text-[9px] text-white/10 uppercase tracking-[0.3em] pt-12">
                    12:01 — Your time to return to yourself.
                </p>
            </div>
        </main>
    );
}
