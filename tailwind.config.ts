/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        darkBlue: "#101114",
        'hyped-red': "#FF9595",
        'hyped-yellow': "#FFC895",
        'hyped-light-blue': "#D6E0E9",
        'hyped-blue': "#ACB2E4",
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/nesting"),
    require("@tailwindcss/typography"),
  ],
};
