import { AbsoluteFill } from "remotion";
import React from "react";

interface ColorGradeProps {
    mode: 'dawn' | 'noon' | 'dusk' | 'ocean' | 'forest' | 'rain' | 'snow' | 'night';
}

export const ColorGrade: React.FC<ColorGradeProps> = ({ mode }) => {
    const getFilter = () => {
        switch (mode) {
            case 'dawn': return "brightness(0.8) saturate(0.7) hue-rotate(-10deg)";
            case 'noon': return "brightness(1.1) saturate(0.9) sepia(0.1)";
            case 'dusk': return "brightness(0.9) saturate(1.2) hue-rotate(15deg)";
            case 'night': return "brightness(0.6) saturate(0.5) contrast(1.2)";
            default: return "none";
        }
    };

    return (
        <AbsoluteFill
            style={{
                backdropFilter: getFilter(),
                pointerEvents: 'none',
                zIndex: 10
            }}
        />
    );
};
