/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://*.tosspayments.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
