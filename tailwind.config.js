module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {},
    colors: {
      primary: {
        100: "#9C99AC",
        200: "#9590B5",
        300: "#6D6699",
        400: "#8679D2",
        500: "#7A6ADB",
        600: "#6353C6",
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}