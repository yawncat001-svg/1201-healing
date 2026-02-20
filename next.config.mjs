/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://*.tosspayments.com https://js.tosspayments.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self' https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' https://static.cloudflareinsights.com https://*.tosspayments.com https://api.tosspayments.com; frame-src 'self' https://*.tosspayments.com;",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
