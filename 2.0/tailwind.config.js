/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "markusRed" : "#dc2626",
        "markusRedSecondary" : "#991b1b"
      },

      fontFamily: {

      }
    },

  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}