/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#F4C753",
      },
      fontFamily: {
        quintessential: ["Quintessential", "serif"],
      },
    },
  },
  plugins: [],
};
