const fs = require("fs");
const { BASE_PATH, exclude, lineStartByURLRegExp } = require("./common");

const urlGlobalRegExp = new RegExp(lineStartByURLRegExp, "g");

function visit(path) {
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
        visit(subPath);
        return;
      }
      if (stats.isFile()) {
        if (!file.endsWith(".md")) return;
        let content = fs.readFileSync(fullSubPath, { encoding: "utf-8" });

        // 发布到网站上，需要 一些 正则化 处理
        // 简单代码框 中文符号 格式化
        if (/·(\w+)·/.test(content)) {
          content = content.replace(/·(\w+)·/g, "`$1`");
          console.log(`${fullSubPath} 完成 简单代码框 中文符号 格式化`);
        }

        // url 格式化
        if (lineStartByURLRegExp.test(content)) {
          content = content.replace(urlGlobalRegExp, "$1[$2]($2)");
          console.log(`${fullSubPath} 完成 url 格式化`);
        }

        fs.writeFileSync(fullSubPath, content);
      }
    });
  }
}

visit("");
