/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            // Change to your backend URL in production
            destination: process.env.NODE_ENV === 'release' ? "https://django-1ttake37hree.app.secoder.net/:path*" : (process.env.NODE_ENV === 'development' ? "https://django-dev-1ttake37hree.app.secoder.net/:path*" : "http://127.0.0.1:8000/:path*") ,
        }];
    }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
