/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-b.udemycdn.com', // Cho phép ảnh khóa học của Udemy
      },
      {
        protocol: 'https',
        hostname: 'www.udemy.com',
      },
    ],
  },
};

export default nextConfig;