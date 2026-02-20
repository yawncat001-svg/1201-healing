import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "1201 — 당신이 당신에게 돌아오는 시간",
    description:
        "12시 01분, 잠깐 멈춰도 괜찮은 시간. 과학 기반 디지털 힐링 공간.",
    openGraph: {
        title: "1201",
        description: "당신이 당신에게 돌아오는 시간",
        url: "https://1201.yawncat.co.kr",
        siteName: "1201",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link
                    rel="stylesheet"
                    as="style"
                    crossOrigin="anonymous"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
                />
            </head>
            <body className="font-sans bg-black text-white antialiased">
                {children}
            </body>
        </html>
    );
}
