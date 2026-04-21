/** @type {import('next').NextConfig} */
const nextConfig = {
  // ลบ distDir และ output ออกเพื่อให้ Vercel จัดการเอง
  
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

  // สำหรับ Next.js 15 Server Actions เป็น Stable แล้ว ไม่ต้องใส่ experimental ก็ได้ครับ
  // หรือถ้าจะใส่ให้ใส่แบบเรียบง่ายที่สุด
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