/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EBDDBE",
        secondary: "#64748b",
        background: "#ffffff",
        text: "#1e293b",
        error: "#ef4444",
        success: "#22c55e",
      },
    },
  },
  plugins: [],
};
