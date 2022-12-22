/** @type {import('tailwindcss').Config} */

const disabledCss = {
  pre: false,
  "pre code": false,
};

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        "source-sans-pro": ["Source Sans Pro", "sans-serif"],
        "martian-mono": ["Martian Mono", "monospace"],
      },
      typography: {
        DEFAULT: { css: disabledCss },
        sm: { css: disabledCss },
        lg: { css: disabledCss },
        xl: { css: disabledCss },
        "2xl": { css: disabledCss },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
