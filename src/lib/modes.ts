export type Mode = "dawn" | "noon" | "dusk";

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
};
