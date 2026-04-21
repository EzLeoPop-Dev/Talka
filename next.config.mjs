/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. บังคับชื่อโฟลเดอร์ output (ช่วยแก้ปัญหา ENOENT / .next)
  distDir: '.next',

  // 2. ตั้งค่า standalone mode (แนะนำสำหรับ Next.js 15 บน Vercel เพื่อช่วยการทำ tracing)
  output: 'standalone',

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

  // 3. แก้ไข allowedDevOrigins ให้ถูกต้องตามโครงสร้างใหม่ (อยู่ภายใต้ experimental)
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