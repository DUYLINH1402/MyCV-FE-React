// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  // Bật chế độ dark mode dựa trên class 'dark' ở thẻ html
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Font chữ monospace cho phong cách IDE
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      // Bảng màu Dracula Theme - phong cách IntelliJ
      colors: {
        dracula: {
          background: "#282a36",
          current: "#44475a",
          foreground: "#f8f8f2",
          comment: "#6272a4",
          cyan: "#8be9fd",
          green: "#50fa7b",
          orange: "#ffb86c",
          pink: "#ff79c6",
          purple: "#bd93f9",
          red: "#ff5555",
          yellow: "#f1fa8c",
        },
      },
    },
  },
  plugins: [],
};
