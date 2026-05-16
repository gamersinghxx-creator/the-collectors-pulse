import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'en.onepiece-cardgame.com' },
      { protocol: 'https', hostname: 'pokemoncenter.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: '*.reddit.com' },
      { protocol: 'https', hostname: '*.redd.it' },
      { protocol: 'https', hostname: '*.redditmedia.com' },
      { protocol: 'https', hostname: 'amiami.com' },
      { protocol: 'https', hostname: 'hlj.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ]
  }
};

export default nextConfig;
