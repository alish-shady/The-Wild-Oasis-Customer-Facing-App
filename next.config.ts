import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xesrihhymldcusugbeic.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabinImages/**",
      },
    ],
  },
  // output: "export",
};

export default nextConfig;
