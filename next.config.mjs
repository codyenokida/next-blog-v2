import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "**/kota-blog-efceb.appspot.com/**",
      },
    ],
  },
};

export default withPlaiceholder(nextConfig);
