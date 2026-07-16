/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Coordinator / gallery photos are currently remote placeholder URLs.
  // We use plain <img> tags (not next/image), so no remotePatterns config is required.
};

export default nextConfig;
