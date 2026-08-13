module.exports = {
  reactStrictMode: true,
};
const withVideos = require('next-videos')
module.exports = withVideos({
  webpack(config, options) {
    return config
}});

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]

    });


    return config;
  }
};

