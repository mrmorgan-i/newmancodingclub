/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "73inbdyp68.ufs.sh",
                pathname: "/f/**",
            },
        ],
    }
};

export default nextConfig;
