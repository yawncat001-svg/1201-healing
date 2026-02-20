export interface VideoClip {
    id: string;
    filename: string;
    duration: number;        // 초 단위
    mode: 'dawn' | 'noon' | 'dusk' | 'ocean' | 'forest' | 'rain' | 'snow' | 'night';
    tags: string[];          // ['fog', 'mountain', 'slow']
    source: 'grok' | 'pexels' | 'original';
    r2Key?: string;          // Cloudflare R2 저장 경로
    localPath: string;       // public/videos/ 하위 경로
    createdAt: string;
}

// 초기 테스트용 클립 목록
export const clips: VideoClip[] = [
    {
        id: 'dawn-01',
        filename: 'dawn-fog-mountain.mp4',
        duration: 8,
        mode: 'dawn',
        tags: ['fog', 'mountain'],
        source: 'pexels',
        localPath: '/videos/clips/dawn-fog-mountain.mp4',
        createdAt: '2026-02-20',
    },
    {
        id: 'dawn-02',
        filename: 'dawn-dew-grass.mp4',
        duration: 6,
        mode: 'dawn',
        tags: ['dew', 'grass', 'macro'],
        source: 'grok',
        localPath: '/videos/clips/dawn-dew-grass.mp4',
        createdAt: '2026-02-20',
    },
    {
        id: 'noon-01',
        filename: 'noon-sunlight-curtain.mp4',
        duration: 7,
        mode: 'noon',
        tags: ['sunlight', 'curtain', 'indoor'],
        source: 'pexels',
        localPath: '/videos/clips/noon-sunlight-curtain.mp4',
        createdAt: '2026-02-20',
    },
    {
        id: 'noon-02',
        filename: 'noon-cafe-window.mp4',
        duration: 8,
        mode: 'noon',
        tags: ['cafe', 'window', 'warm'],
        source: 'grok',
        localPath: '/videos/clips/noon-cafe-window.mp4',
        createdAt: '2026-02-20',
    },
    {
        id: 'dusk-01',
        filename: 'dusk-sunset-ocean.mp4',
        duration: 9,
        mode: 'dusk',
        tags: ['sunset', 'ocean', 'waves'],
        source: 'pexels',
        localPath: '/videos/clips/dusk-sunset-ocean.mp4',
        createdAt: '2026-02-20',
    },
    {
        id: 'dusk-02',
        filename: 'dusk-clouds-purple.mp4',
        duration: 7,
        mode: 'dusk',
        tags: ['clouds', 'purple', 'sky'],
        source: 'grok',
        localPath: '/videos/clips/dusk-clouds-purple.mp4',
        createdAt: '2026-02-20',
    },
];

// 모드별 클립 필터
export function getClipsByMode(mode: string): VideoClip[] {
    return clips.filter(c => c.mode === (mode as any));
}
