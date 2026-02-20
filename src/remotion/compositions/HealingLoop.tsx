import { AbsoluteFill, Sequence, Video, useVideoConfig } from "remotion";
import { VideoClip } from "../../lib/clips";
import { CrossFade } from "../components/CrossFade";
import { ColorGrade } from "../components/ColorGrade";
import { VIDEO_CONFIG } from "../config";

interface HealingLoopProps {
    clips: VideoClip[];
    mode: VideoClip['mode'];
}

export const HealingLoop: React.FC<HealingLoopProps> = ({ clips, mode }) => {
    const { fps, durationInFrames } = useVideoConfig();
    const crossFadeFrames = VIDEO_CONFIG.crossFadeDurationInFrames;

    if (clips.length === 0) return null;

    // 클립들을 루프에 맞게 배치
    let currentFrame = 0;
    const sequences: React.ReactNode[] = [];

    // 클립들을 순서대로 배치하되, 5분(9000프레임)을 채움
    while (currentFrame < durationInFrames) {
        for (let i = 0; i < clips.length; i++) {
            const clip = clips[i];
            const clipDurationFrames = clip.duration * fps;

            // 크로스페이드를 고려하여 시퀀스 시작점 조정
            const startFrom = currentFrame === 0 ? 0 : currentFrame - crossFadeFrames;

            sequences.push(
                <Sequence from={startFrom} durationInFrames={clipDurationFrames + crossFadeFrames} key={`${currentFrame}-${i}`}>
                    <Video src={clip.localPath} muted />
                </Sequence>
            );

            currentFrame += clipDurationFrames;
            if (currentFrame >= durationInFrames) break;
        }
    }

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {sequences}
            <ColorGrade mode={mode} />
        </AbsoluteFill>
    );
};
