/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./component/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#3B82F6",
        "accent-dark": "#1D4ED8",
        coin: "#F59E0B",
        "text-main": "#FFFFFF",
        "text-muted": "#94A3B8",
        border: "#2E3A4E",
        card: "#020617",
        surface: "#020617",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        modal: "24px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      boxShadow: {
        "blue-glow": "0 0 40px rgba(59,130,246,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;

