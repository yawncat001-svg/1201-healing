export type Mode = "dawn" | "noon" | "dusk" | "ocean" | "forest" | "rain" | "snow" | "night";

export interface ModeConfig {
  id: Mode;
  name: string;
  nameKR: string;
  subtitle: string;
  gradient: string;
  accentColor: string;
  circleColor: string;
  videoSrc: string;
  soundSrc: string;
  isPremium?: boolean;
}

export const modes: Record<Mode, ModeConfig> = {
  dawn: {
    id: "dawn",
    name: "Dawn",
    nameKR: "고요",
    subtitle: "세상이 아직 조용한 시간",
    gradient: "from-[#0B1354] to-[#C8B6E2]",
    accentColor: "#7B6BA8",
    circleColor: "rgba(200, 182, 226, 0.6)",
    videoSrc: "/videos/dawn-loop.mp4",
    soundSrc: "/sounds/dawn-ambient.mp3",
  },
  noon: {
    id: "noon",
    name: "Noon",
    nameKR: "숨",
    subtitle: "햇살이 창문을 통해 들어오는 시간",
    gradient: "from-[#F5F0E8] to-[#FFFFFF]",
    accentColor: "#C4A882",
    circleColor: "rgba(196, 168, 130, 0.6)",
    videoSrc: "/videos/noon-loop.mp4",
    soundSrc: "/sounds/noon-ambient.mp3",
  },
  dusk: {
    id: "dusk",
    name: "Dusk",
    nameKR: "놓음",
    subtitle: "하루를 내려놓는 시간",
    gradient: "from-[#E8833A] to-[#4A1942]",
    accentColor: "#D4627A",
    circleColor: "rgba(212, 98, 122, 0.6)",
    videoSrc: "/videos/dusk-loop.mp4",
    soundSrc: "/sounds/dusk-ambient.mp3",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    nameKR: "파도",
    subtitle: "끝없이 밀려오는 평화",
    gradient: "from-[#1A3C40] to-[#EDE6DB]",
    accentColor: "#1A3C40",
    circleColor: "rgba(26, 60, 64, 0.6)",
    videoSrc: "/videos/premium/ocean-loop.mp4",
    soundSrc: "/sounds/premium/ocean.mp3",
    isPremium: true,
  },
  forest: {
    id: "forest",
    name: "Forest",
    nameKR: "숲속",
    subtitle: "초록의 숨소리가 들리는 곳",
    gradient: "from-[#2C3333] to-[#A5C9CA]",
    accentColor: "#395B64",
    circleColor: "rgba(57, 91, 100, 0.6)",
    videoSrc: "/videos/premium/forest-loop.mp4",
    soundSrc: "/sounds/premium/forest.mp3",
    isPremium: true,
  },
  rain: {
    id: "rain",
    name: "Rain",
    nameKR: "빗물",
    subtitle: "창가를 적시는 차분한 소음",
    gradient: "from-[#21243D] to-[#FF7597]",
    accentColor: "#21243D",
    circleColor: "rgba(33, 36, 61, 0.6)",
    videoSrc: "/videos/premium/rain-loop.mp4",
    soundSrc: "/sounds/premium/rain.mp3",
    isPremium: true,
  },
  snow: {
    id: "snow",
    name: "Snow",
    nameKR: "설원",
    subtitle: "하얀 침묵이 덮인 대지",
    gradient: "from-[#0F3D3E] to-[#E2DCC8]",
    accentColor: "#0F3D3E",
    circleColor: "rgba(15, 61, 62, 0.6)",
    videoSrc: "/videos/premium/snow-loop.mp4",
    soundSrc: "/sounds/premium/snow.mp3",
    isPremium: true,
  },
  night: {
    id: "night",
    name: "Night",
    nameKR: "별밤",
    subtitle: "우주의 고요가 쏟아지는 밤",
    gradient: "from-[#000000] to-[#434343]",
    accentColor: "#1a1a1a",
    circleColor: "rgba(255, 255, 255, 0.2)",
    videoSrc: "/videos/premium/night-loop.mp4",
    soundSrc: "/sounds/premium/night.mp3",
    isPremium: true,
  },
};
