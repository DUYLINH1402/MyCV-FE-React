// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Bật chế độ dark mode dựa trên class 'dark' ở thẻ html
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Font chữ Monospace - ưu tiên JetBrains Mono theo style IntelliJ
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      // Bảng màu Dracula Theme - phong cách IntelliJ IDE
      colors: {
        dracula: {
          background: "#282a36", // Màu nền chính
          current: "#44475a", // Màu nền highlight/current line
          foreground: "#f8f8f2", // Màu chữ chính
          comment: "#6272a4", // Màu comment/muted text
          cyan: "#8be9fd", // Cyan cho các keyword
          green: "#50fa7b", // Green cho strings/success
          orange: "#ffb86c", // Orange cho variables
          pink: "#ff79c6", // Pink cho annotations
          purple: "#bd93f9", // Purple cho keywords
          red: "#ff5555", // Red cho errors
          yellow: "#f1fa8c", // Yellow cho strings/warnings
        },
      },
    },
  },
  plugins: [],
};
