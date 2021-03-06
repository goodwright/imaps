const colors = require("./src/colors").colors;

module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: {
      safelist: [/h-/, /w-/, /mr-/]
    }
  },
  darkMode: false,
  theme: {
    extend: {
      width: {
        100: "25rem",
      },
      height: {
        "fit": "fit-content"
      },
      fontSize: {
        "2xs": ".625rem",
        "3xs": ".5rem",
      },
      gridTemplateRows: {
        "mob-base": "3.5rem 1fr",
        "base": "3.5rem 1fr",
      },
      gridTemplateColumns: {
        "mob-base": "3rem 1fr",
        "base": "12.5rem 1fr",
      },
      screens: {
        "3xl": "1800px",
        "4xl": "2100px"
      },
      colors
    },
  },
  variants: {
    extend: {
      boxShadow: ["active"],
    },
  },
  plugins: [],
}