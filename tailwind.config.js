/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // TODO: placeholder values — replace with the real design tokens
      colors: {
        "burnt-orange": "#BF5700",
        "card-border": "#E0E1E6",
        "saved-bg": "rgba(0, 0, 0, 0.5)",
        "gray-text": "#60646C",
        "status-open": "#16A34A",
        "status-closing": "#D97706",
        "status-closed": "#DC2626",
      },
      fontSize: {
        tag: "12px",
        status: "12px",
        "spot-name": "16px",
      },
    },
  },
  plugins: [],
};
