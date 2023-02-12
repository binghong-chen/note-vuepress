const fs = require("fs");

const BASE_PATH = "./note";

// 暂时排除的菜单
const exclude = [".git", ".vuepress", ".gitignore", ".DS_Store", "assets"];

function visit(path) {
  var children = [];
  const fullPath = `${BASE_PATH}/${path}`;
  var stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    var files = fs.readdirSync(fullPath).sort((a, b) => (a < b ? -1 : 1));
    files.forEach((file) => {
      if (exclude.includes(file)) return;
      let subPath = `${path}/${file}`;
      if (subPath.startsWith("/")) subPath = subPath.substring(1);
      const fullSubPath = `${BASE_PATH}/${subPath}`;
      stats = fs.statSync(fullSubPath);
      if (stats.isDirectory()) {
        const thisChildren = visit(subPath);
        if (!thisChildren.length) return;
        children.push({
          title: file,
          children: thisChildren,
          sidebarDepth: 0,
        });
        return;
      }
      if (stats.isFile()) {
        if (!file.endsWith(".md")) return;
        if (file === "README.md") return;
        children.push(subPath);
      }
    });
  }
  return children;
}

module.exports = {
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      {
        text: "GitHub",
        link: "https://github.com/binghong-chen",
        target: "_blank",
      },
    ],
    sidebar: visit(""),
  },
  extendMarkdown(md) {
    md.set({ html: true });
    md.use(require("markdown-it-katex"));
  },
};
