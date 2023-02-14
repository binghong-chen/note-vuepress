const fs = require("fs");
const { BASE_PATH, exclude } = require("../../common");

const check = require("../../index");

function visit(path) {
  var children = [];
  const fullPath = `${BASE_PATH}/${path}`;
  var stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    var files = fs.readdirSync(fullPath).sort((a, b) => (a < b ? -1 : 1));
    const filterFiles = files
      .filter((file) => !exclude.includes(file))
      .map((file) => {
        let subPath = `${path}/${file}`;
        if (subPath.startsWith("/")) subPath = subPath.substring(1);
        const fullSubPath = `${BASE_PATH}/${subPath}`;
        return { file, subPath, fullSubPath, stats: fs.statSync(fullSubPath) };
      });
    // 先排目录
    filterFiles
      .filter(({ stats }) => stats.isDirectory())
      .forEach(({ file, subPath }) => {
        const thisChildren = visit(subPath);
        if (!thisChildren.length) return;
        children.push({
          title: file,
          children: thisChildren,
          sidebarDepth: 0,
        });
      });
    // 再排文件
    filterFiles
      .filter(
        ({ file, fullSubPath, stats }) =>
          stats.isFile() &&
          file.endsWith(".md") &&
          file !== "README.md" &&
          check(fullSubPath)
      )
      .forEach(({ subPath }) => children.push(subPath));
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
