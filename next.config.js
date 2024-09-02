/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
