/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        colors: {
          netflix: "#E50914",
          dark: "#141414",
          grayDark: "#181818",
        },
        fontFamily: {
          sans: ["Helvetica Neue", "Arial", "sans-serif"],
        },
      },
    },
    plugins: [],
  };