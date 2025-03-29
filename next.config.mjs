/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['placehold.co', 'i.ibb.co'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    devIndicators: false
};

export default nextConfig;