/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      sans: [
        "Rubik",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    extend: {
      screens: {
        xs: "375px",
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px",
        "max-xs": { max: "374px" },
        "max-sm": { max: "539px" },
        "max-md": { max: "719px" },
        "max-lg": { max: "959px" },
        "max-xl": { max: "1139px" },
      },
    },
  },
  plugins: [],
});
