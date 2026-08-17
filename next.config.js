const withVideos = require('next-videos');

// One config object. Previously this file assigned module.exports three times,
// so only the last (the SVG rule) took effect and reactStrictMode + next-videos
// were silently dropped. All three are now merged here.
module.exports = withVideos({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});
