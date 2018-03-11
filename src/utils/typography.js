import Typography from "typography";
import theme from "typography-theme-ocean-beach";

theme.bodyFontFamily = ["Open Sans", "sans-serif"];
theme.googleFonts = [
  {name: "Roboto Slab", styles: ["700"]},
  {
    name: "Open Sans",
    styles: ["400", "400i", "400b"],
  },
];

const typography = new Typography(theme);
export default typography;
