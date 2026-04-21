/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: [
        'unruly-coveted-stubble.ngrok-free.dev',
        'localhost:3001'
      ],
    },
  },
};

export default nextConfig;