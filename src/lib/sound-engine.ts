"use client";

export interface SoundChannel {
    id: string;
    name: string;
    nameKR: string;
    category: 'nature' | 'ambient' | 'masking';
    filename: string;
    icon: string;
    defaultVolume: number;
}

export const SOUND_LIBRARY: SoundChannel[] = [
    { id: 'rain', name: 'Rain', nameKR: '비', category: 'nature', filename: 'rain.mp3', icon: '🌧️', defaultVolume: 0.5 },
    { id: 'birds', name: 'Birds', nameKR: '새소리', category: 'nature', filename: 'birds.mp3', icon: '🐦', defaultVolume: 0.3 },
    { id: 'wind', name: 'Wind', nameKR: '바람', category: 'nature', filename: 'wind.mp3', icon: '💨', defaultVolume: 0.4 },
    { id: 'waves', name: 'Waves', nameKR: '파도', category: 'nature', filename: 'waves.mp3', icon: '🌊', defaultVolume: 0.5 },
    { id: 'creek', name: 'Creek', nameKR: '시냇물', category: 'nature', filename: 'creek.mp3', icon: '💧', defaultVolume: 0.4 },
    { id: 'thunder', name: 'Thunder', nameKR: '천둥', category: 'nature', filename: 'thunder.mp3', icon: '⚡', defaultVolume: 0.2 },
    { id: 'cafe', name: 'Café', nameKR: '카페', category: 'ambient', filename: 'cafe.mp3', icon: '☕', defaultVolume: 0.3 },
    { id: 'fire', name: 'Fireplace', nameKR: '벽난로', category: 'ambient', filename: 'fire.mp3', icon: '🔥', defaultVolume: 0.4 },
    { id: 'night', name: 'Night', nameKR: '밤', category: 'ambient', filename: 'night-insects.mp3', icon: '🌙', defaultVolume: 0.3 },
    { id: 'pink-noise', name: 'Pink Noise', nameKR: '핑크노이즈', category: 'masking', filename: 'pink-noise.mp3', icon: '〰️', defaultVolume: 0.2 },
    { id: 'brown-noise', name: 'Brown Noise', nameKR: '브라운노이즈', category: 'masking', filename: 'brown-noise.mp3', icon: '〰️', defaultVolume: 0.2 },
    { id: 'white-noise', name: 'White Noise', nameKR: '화이트노이즈', category: 'masking', filename: 'white-noise.mp3', icon: '〰️', defaultVolume: 0.15 },
];

export const TINNITUS_PRESETS = [
    {
        name: '고주파 이명 완화',
        nameKR: '높은 삐 소리',
        layers: [
            { id: 'rain', volume: 0.6 },
            { id: 'pink-noise', volume: 0.25 },
            { id: 'creek', volume: 0.3 },
        ],
    },
    {
        name: '저주파 이명 완화',
        nameKR: '웅웅거림',
        layers: [
            { id: 'brown-noise', volume: 0.3 },
            { id: 'waves', volume: 0.5 },
            { id: 'wind', volume: 0.3 },
        ],
    },
    {
        name: '집중 모드',
        nameKR: '집중이 필요할 때',
        layers: [
            { id: 'cafe', volume: 0.3 },
            { id: 'rain', volume: 0.4 },
        ],
    },
];

class SoundEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private nodes: Map<string, { source: AudioBufferSourceNode; gain: GainNode; buffer: AudioBuffer }> = new Map();
    private initialized = false;

    async init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.initialized = true;
    }

    async loadSound(channelId: string): Promise<AudioBuffer | null> {
        if (!this.ctx) return null;
        const channel = SOUND_LIBRARY.find(s => s.id === channelId);
        if (!channel) return null;

        try {
            const response = await fetch(`/sounds/${channel.category}/${channel.filename}`);
            if (!response.ok) throw new Error('File not found');
            const arrayBuffer = await response.arrayBuffer();
            return await this.ctx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.warn(`Sound load failed: ${channelId}`, e);
            return null;
        }
    }

    async play(channelId: string, volume: number = 0.5) {
        if (!this.ctx || !this.masterGain) await this.init();
        if (this.nodes.has(channelId)) return;

        const buffer = await this.loadSound(channelId);
        if (!buffer || !this.ctx || !this.masterGain) return;

        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();

        source.buffer = buffer;
        source.loop = true;
        gain.gain.value = volume;

        source.connect(gain);
        gain.connect(this.masterGain);
        source.start();

        this.nodes.set(channelId, { source, gain, buffer });
    }

    stop(channelId: string) {
        const node = this.nodes.get(channelId);
        if (node) {
            try {
                node.source.stop();
                node.source.disconnect();
                node.gain.disconnect();
            } catch (e) { }
            this.nodes.delete(channelId);
        }
    }

    setVolume(channelId: string, volume: number) {
        const node = this.nodes.get(channelId);
        if (node) {
            node.gain.gain.setTargetAtTime(volume, this.ctx!.currentTime, 0.1);
        }
    }

    setMasterVolume(volume: number) {
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
        }
    }

    async applyPreset(preset: any) {
        // 모든 현재 소리 정지
        const keys = Array.from(this.nodes.keys());
        keys.forEach(k => this.stop(k));

        // 프리셋 적용
        for (const layer of preset.layers) {
            await this.play(layer.id, layer.volume);
        }
    }

    getActiveLayers() {
        return Array.from(this.nodes.keys());
    }

    dispose() {
        this.nodes.forEach((_, id) => this.stop(id));
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
        this.initialized = false;
    }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;
