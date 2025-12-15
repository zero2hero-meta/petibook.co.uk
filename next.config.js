/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['0ec90b57d6e95fcbda19832f.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
