"use client";

import { clips } from "@/lib/clips";
import { GROK_PROMPTS } from "@/lib/grok-prompts";
import { SOUND_LIBRARY } from "@/lib/sound-engine";
import { useState } from "react";
import { Copy, Plus, Video, Music, Terminal } from "lucide-react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'clips' | 'prompts' | 'sounds'>('clips');

    return (
        <main className="min-h-screen bg-black text-white/90 p-8 font-mono">
            <header className="mb-12 border-b border-white/10 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-light tracking-widest uppercase">12:01 Admin</h1>
                    <p className="text-[10px] text-white/30 mt-2">Content Pipeline & Library Management</p>
                </div>
                <div className="flex gap-4">
                    {(['clips', 'prompts', 'sounds'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${activeTab === tab ? "bg-white text-black border-white" : "text-white/40 border-white/10 hover:border-white/40"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Clips Tab */}
            {activeTab === 'clips' && (
                <section className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                            <Video size={14} /> Registered Video Clips
                        </h2>
                        <button className="text-[10px] text-white/30 flex items-center gap-2 hover:text-white transition-colors">
                            <Plus size={12} /> Add New Clip
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clips.map((clip: any) => (
                            <div key={clip.id} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/8 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{clip.mode}</span>
                                    <span className="text-[10px] text-white/20 uppercase">{clip.duration}s</span>
                                </div>
                                <h3 className="text-xs text-white/80 truncate mb-1">{clip.filename}</h3>
                                <p className="text-[9px] text-white/30">{clip.localPath}</p>
                                <div className="mt-4 flex gap-2">
                                    {clip.tags.map((tag: string) => (
                                        <span key={tag} className="text-[8px] text-white/20 border border-white/5 px-2 py-0.5 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Prompts Tab */}
            {activeTab === 'prompts' && (
                <section className="animate-fade-in">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 mb-6">
                        <Terminal size={14} /> Grok Imagine Prompts
                    </h2>
                    <div className="space-y-8">
                        {Object.entries(GROK_PROMPTS).map(([mode, prompts]) => (
                            <div key={mode} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-[10px] uppercase tracking-widest text-white/60">{mode}</h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {prompts.map((prompt: string, i: number) => (
                                        <div key={i} className="p-6 flex justify-between items-start gap-8 hover:bg-white/2 transition-all group">
                                            <p className="text-[11px] leading-relaxed text-white/40 group-hover:text-white/70 transition-colors italic">
                                                "{prompt}"
                                            </p>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(prompt)}
                                                className="p-2 text-white/10 hover:text-white/60 transition-colors"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Sounds Tab */}
            {activeTab === 'sounds' && (
                <section className="animate-fade-in">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 mb-6">
                        <Music size={14} /> Global Sound Library
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SOUND_LIBRARY.map((sound: any) => (
                            <div key={sound.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-white/20 transition-all">
                                <span className="text-2xl mb-4 opacity-40 group-hover:opacity-100 transition-opacity">{sound.icon}</span>
                                <h3 className="text-xs text-white/80 mb-1">{sound.nameKR}</h3>
                                <p className="text-[9px] text-white/30 uppercase tracking-widest">{sound.name}</p>
                                <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/20" style={{ width: `${sound.defaultVolume * 100}%` }} />
                                </div>
                                <span className="text-[8px] text-white/10 mt-2">{sound.filename}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
