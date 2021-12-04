module.exports = {
  mode: "jit",
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}"
  ],
  darkMode: false, // or 'media' or 'class'
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        "hero-md": "500px",
        "hero-lg": "560px",
        "hero-xl": "850px",
        "view-md": "480px",
        "view-hd": "600px",
        "view-fhd": "900px",
        "table-md": "415px",
        "table-hd": "535px",
        "table-fhd": "815px"
      },
      colors: {
        primary: "#4AABFF",
        secondary: "#2d94ed"
      }
    }
  },
  plugins: []
};
