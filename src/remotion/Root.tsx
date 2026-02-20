import { Composition } from "remotion";
import { HealingLoop } from "./compositions/HealingLoop";
import { VIDEO_CONFIG } from "./config";
import { getClipsByMode } from "../lib/clips";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="DawnLoop"
                component={HealingLoop}
                durationInFrames={VIDEO_CONFIG.durationInFrames}
                fps={VIDEO_CONFIG.fps}
                width={VIDEO_CONFIG.width}
                height={VIDEO_CONFIG.height}
                defaultProps={{
                    clips: getClipsByMode('dawn'),
                    mode: 'dawn' as const
                }}
            />
            <Composition
                id="NoonLoop"
                component={HealingLoop}
                durationInFrames={VIDEO_CONFIG.durationInFrames}
                fps={VIDEO_CONFIG.fps}
                width={VIDEO_CONFIG.width}
                height={VIDEO_CONFIG.height}
                defaultProps={{
                    clips: getClipsByMode('noon'),
                    mode: 'noon' as const
                }}
            />
            <Composition
                id="DuskLoop"
                component={HealingLoop}
                durationInFrames={VIDEO_CONFIG.durationInFrames}
                fps={VIDEO_CONFIG.fps}
                width={VIDEO_CONFIG.width}
                height={VIDEO_CONFIG.height}
                defaultProps={{
                    clips: getClipsByMode('dusk'),
                    mode: 'dusk' as const
                }}
            />
        </>
    );
};
