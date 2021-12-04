export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "IOEconomic Model",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    ],
    script: [
      {
        src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
        type: "module",
        body: true,
      },
      {
        src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
        type: "nomodule",
        body: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    "@nuxtjs/pwa",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/pwa"],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  manifest: {
    name: "IO Economic",
    lang: "en",
    background_color: "#FFFFFF",
    theme_color: "#F8F8F8",
    theme_color: "#F8F8F8",
    icons: [
      {
        src: "logo.jpeg",
        size: "196x196",
        type: "image/jpeg",
      },
    ],
  },

  pwa: {
    meta: {
      title: "IO Economic",
      author: "Sainseni",
    },
    manifest: {
      name: "IO Economic",
      short_name: "IO Economic",
      description: "IO Economic Model Calculator",
      display: "standalone",
      lang: "en",
    },
    icon: {
      filename: "icon.png",
      sizes: [64, 120, 144, 152, 192, 384, 512],
    },
    workbox: {
      /* workbox options */
      dev: true,
      offlineStrategy: "StaleWhileRevalidate",
    },
  },
};
