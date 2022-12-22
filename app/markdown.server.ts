import { Converter } from "showdown";
import showdownHighlight from "showdown-highlight";

const converter = new Converter({
  extensions: [
    showdownHighlight({
      pre: true,
      auto_detection: true,
    }),
    {
      type: "output",
      filter: (text) => {
        return text.replace('<pre class="', '<pre class="not-prose ');
      },
    },
  ],
});
converter.setFlavor("github");

export const markdownToHTML = (md: string) => {
  return converter.makeHtml(md);
};
