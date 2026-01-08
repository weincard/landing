/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix hydration issues with Radix UI components
  experimental: {
    // Ensures consistent IDs between server and client for Radix components
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
    ],
  },
  // Suppress hydration warnings for known Radix UI ID mismatches
  // This is a temporary fix until Radix UI provides a better solution
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
