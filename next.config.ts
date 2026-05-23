import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'en.onepiece-cardgame.com' },
      { protocol: 'https', hostname: 'pokemoncenter.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: '**.reddit.com' },
      { protocol: 'https', hostname: '**.redd.it' },
      { protocol: 'https', hostname: '**.redditmedia.com' },
      { protocol: 'https', hostname: '**.reddituploads.com' },
      { protocol: 'https', hostname: 'amiami.com' },
      { protocol: 'https', hostname: 'hlj.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '**.imgur.com' },
      { protocol: 'https', hostname: 'preview.redd.it' },
      { protocol: 'https', hostname: 'external-preview.redd.it' },
    ]
  },
  // Ensure the build doesn't fail if env vars are missing at build time
  // (they are injected at runtime by Vercel/Railway)
  experimental: {}
};

export default nextConfig;
