/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dev uses NEXT_DIST_DIR=.next-dev (see package.json) so `next build` never clobbers
  // the running dev server's webpack chunks in .next/.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid stale/corrupt filesystem cache when the IDE and dev server both touch .next-dev/.
      config.cache = { type: "memory" };

      // Polling avoids EMFILE watcher errors when many processes/files are open (e.g. Cursor IDE).
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
