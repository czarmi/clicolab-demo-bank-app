/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clicolab: {
          primary: '#0F62FE',
          dark: '#0B1F3A',
        },
      },
    },
  },
  plugins: [],
};
