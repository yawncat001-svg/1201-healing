export const VIDEO_CONFIG = {
    fps: 30,
    width: 1920,
    height: 1080,
    // 5분 = 300초 = 9000프레임 (30fps)
    durationInFrames: 9000,
    // 클립 간 크로스페이드 시간 (초)
    crossFadeDurationInFrames: 60, // 2초 * 30fps
};

export const MOBILE_CONFIG = {
    fps: 30,
    width: 1080,
    height: 1920,
    durationInFrames: 9000,
    crossFadeDurationInFrames: 60,
};
