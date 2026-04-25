import typography from "@tailwindcss/typography";
import daisyui from "daisyui";
import plugin from "tailwindcss/plugin";

const palette = {
  black: {
    DEFAULT: "#000000",
    100: "#171717",
    200: "#2F2B3D",
    300: "#252525",
  },
  blue: {
    DEFAULT: "#1576f9",
  },
  gray: {
    DEFAULT: "#666666",
    100: "#888888",
    200: "#D0CCC4",
  },
  green: {
    DEFAULT: "#058107",
    100: "#7A9C59",
  },
  white: {
    DEFAULT: "#FFFFFF",
    100: "#F8F5F0",
    200: "#E9E6E0",
  },
  red: {
    DEFAULT: "#FF0000",
  },
  yellow: {
    DEFAULT: "#ffd700",
  },
  orange: {
    DEFAULT: "#FF7900",
  },
};

export default {
  content: ["./app/**/*.{vue,js,ts}", "./server/**/*.{js,ts}", "./nuxt.config.{js,ts}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Lexend", "Roboto"],
      },
      screens: {
        tablet: "640px",
      },
      colors: {
        ...palette,
        primary: palette.orange.DEFAULT,
      },
    },
  },
  plugins: [
    daisyui,
    typography,
    plugin(({ addBase }) => {
      const darkVars = {
        "--color-bg-header": palette.black[100],
        "--color-bg-login": palette.orange.DEFAULT,
        "--color-bg-app": palette.orange.DEFAULT,
        "--color-txt-menu": palette.gray[100],
        "--color-txt-menu-active": palette.white.DEFAULT,
        "--color-orange": palette.orange.DEFAULT,
        "--color-white": palette.white.DEFAULT,
        "--color-title-section": palette.black[200],
        "--color-txt-desc-offer": palette.gray[100],
        "--color-bg-offer": palette.white[100],
        "--color-bg-deliver": palette.white[200],
      };

      const lightVars = {
        "--color-bg-header": palette.white.DEFAULT,
        "--color-bg-app": palette.orange.DEFAULT,
      };

      addBase({
        ":root": darkVars,
        '[data-theme="dark"]': darkVars,
        '[data-theme="light"]': lightVars,
        body: {
          backgroundColor: "var(--color-bg-app)",
        },
      });
    }),
  ],
};
