/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    POCKETBASE_URL: process.env.POCKETBASE_URL,
  },
};

module.exports = nextConfig;
