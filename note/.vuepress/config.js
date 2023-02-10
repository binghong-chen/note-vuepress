const fs = require("fs");

const BASE_PATH = "./note";

let fileTotal = 0
let nonNullFileTotal = 0

function visit(path) {
  var children = [];
  const fullPath = `${BASE_PATH}/${path}`;
  var stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    var files = fs.readdirSync(fullPath);
    files.forEach((file) => {
      if (file === ".git") return;
      if (file === ".vuepress") return;
      if (file === ".gitignore") return;
      if (file === ".DS_Store") return;
      if (file === "assets") return;
      const subPath = `${path}/${file}`;
      const fullPath = `${BASE_PATH}/${subPath}`;
      stats = fs.statSync(fullPath);
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
        fileTotal++
        let content = fs.readFileSync(fullPath, { encoding: "utf-8" });
        // 过滤空文件
        if (
          content.split("\n").filter((line) => {
            line = line.trim();
            return (
              line.length &&
              !/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
                line
              )
            );
          }).length <= 2
        ) {
          console.log(`${fullPath} 为空`);
          return;
        }
        // tag 中文符号正规化
        content = content.replace(/·(\w+)·/g, "`$1`");
        // url 正规化
        content = content.replace(
          /(\n\s*)((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g,
          "$1[$2]($2)"
        );
        fs.writeFileSync(fullPath, content);

        nonNullFileTotal++

        if (file === "README.md") {
          console.log(fullPath)
          return;
        }
        file = file.substring(0, file.lastIndexOf("."));
        children.push(subPath);
      }
    });
  }
  return children;
}

const sidebar = visit('')

console.log('文件数目', fileTotal)
console.log('有效文件数目', nonNullFileTotal)

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
    sidebar,
  },
  extendMarkdown(md) {
    md.set({ html: true });
    md.use(require("markdown-it-katex"));
  },
};
