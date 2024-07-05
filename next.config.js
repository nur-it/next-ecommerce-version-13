const runtimeCaching = require("next-pwa/cache");
const nextTranslate = require("next-translate");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  scope: "/",
  sw: "service-worker.js",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  reactStrictMode: false,
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_BASE_URL: "http://alamgirh1.localhost:3000",
  },
  async rewrites() {
    return [
      {
        source: "/about",
        destination: "/",
      },
    ];
  },

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "images.unsplash.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "img.icons8.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "i.ibb.co",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "i.postimg.cc",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "fakestoreapi.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "res.cloudinary.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "lh3.googleusercontent.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "cloudclever.b-cdn.net",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: ".cloudclever.com",
  //       pathname: "images.cloudclever.com",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "",
  //       pathname: "storage.bunnycdn.com",
  //     },
  //   ],
  // },
  images: {
    domains: [
      "images.unsplash.com",
      "img.icons8.com",
      "i.ibb.co",
      "ibb.co",
      "i.postimg.cc",
      "fakestoreapi.com",
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "cloudclever.b-cdn.net",
      "images.cloudclever.com",
      "storage.bunnycdn.com",
      "",
    ],
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // images: {
  //   loader: 'imgix',
  //   path: '/',
  // },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en-US", "es", "fr", "nl-NL"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en-US",
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    domains: [
      {
        domain: "example.com",
        defaultLocale: "en-US",
        // other locales that should be handled on this domain
        locales: ["es"],
      },
      {
        domain: "example.nl",
        defaultLocale: "nl-NL",
      },
      {
        domain: "example.fr",
        defaultLocale: "fr",
      },
    ],
  },

  ...nextTranslate(),
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

// module.exports = withBundleAnalyzer({});
