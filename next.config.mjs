/* eslint-disable no-param-reassign */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dsqosoeyathhjxgyduin.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/klaytnticketing-bucket/**',
      },
    ],
  },
};

export default nextConfig;
