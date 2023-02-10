/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        darkmode: {
          50: "#FB923C", // selected highlight
          100: "#f2e8e5", // search bar background
          200: "#FDBA74", // selected highlight active
          300: "#B2ACA2", // free
          400: "#d2bab0", // free
          500: "#1e2021", // navbar and bar background
          600: "#a18072", // free
          700: "#1A1B18", // free
          800: "#181a1b", // background
          900: "#43302b", // free
        },
      },
    },
  },
  safelist: [
    {
      pattern:
        /(bg|text|border)-darkmode-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
};
