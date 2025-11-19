/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zonapet-files.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        // S3 bucket used by Weincard files (used by next/image)
        hostname: "weincard-files.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
