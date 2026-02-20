import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/components/Providers";
import AuthSync from "@/components/AuthSync";

export const metadata: Metadata = {
    title: "1201 — 당신이 당신에게 돌아오는 시간",
    description: "12시 01분, 잠깐 멈춰도 괜찮은 시간.",
    openGraph: {
        title: "1201",
        description: "당신이 당신에게 돌아오는 시간",
        url: "https://1201.yawncat.co.kr",
        siteName: "1201",
        type: "website",
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "12:01",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="bg-black antialiased">
                <Providers>
                    <AuthSync />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
