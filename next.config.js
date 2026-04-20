/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['image.tmdb.org'] },
  webpack: (config) => {
    config.externals.push({ docx: 'commonjs docx' });
    return config;
  },
};
module.exports = nextConfig;