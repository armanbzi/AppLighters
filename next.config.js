const withVideos = require('next-videos');

// One config object. Previously this file assigned module.exports three times,
// so only the last (the SVG rule) took effect and reactStrictMode + next-videos
// were silently dropped. All three are now merged here.
module.exports = withVideos({
  reactStrictMode: true,
  // The old build-focused pages were retired in the "light up your existing app"
  // repositioning. Point their URLs at the closest new destination so inbound
  // links don't 404. Non-permanent (307) while the new IA settles.
  async redirects() {
    return [
      { source: '/AiDevPage', destination: '/services/ai-integration', permanent: false },
      { source: '/WebDevPage', destination: '/Portfolio', permanent: false },
      { source: '/MobileDevPage', destination: '/Portfolio', permanent: false },
      { source: '/BlockDevPage', destination: '/', permanent: false },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});
