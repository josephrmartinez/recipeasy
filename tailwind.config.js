/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
        ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#2D6645",
          "primary-focus": "#285b3e",
      }}
    ]
  }
}

