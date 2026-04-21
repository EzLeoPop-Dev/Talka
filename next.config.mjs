/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🟢 ขั้นตอนสำคัญ: ปิดการแกะรอยไฟล์เพื่อข้าม Error export-detail.json
  outputFileTracing: false, 

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

  // ตั้งค่าสำหรับ Server Actions (ถ้ามีการใช้)
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