import { AbsoluteFill, interpolate } from "remotion";
import React from "react";

interface CrossFadeProps {
    children: React.ReactNode;
    opacity: number;
}

export const CrossFade: React.FC<CrossFadeProps> = ({ children, opacity }) => {
    return (
        <AbsoluteFill style={{ opacity }}>
            {children}
        </AbsoluteFill>
    );
};
