const fs = require("fs");
const { BASE_PATH, exclude, lineStartByURLRegExp } = require("./common");

const tips = [];
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

        // 一些 格式化 处理
        const lines = content.split("\n");
        // 格式化:文章没有标题 添加标题
        if (lines.filter((line) => line.startsWith("#")).length === 0) {
          content = `# ${file.substring(0, file.length - 3)}\n${content}`
          tips.push(`${fullSubPath} 完成 格式化:文章没有标题 添加标题`);
        }

        // 格式化:assets图片使用相对路径
        if (/\((.+)(?<!\.)\/assets/.test(content)) {
          content = content.replace(/\((.+)(?<!\.)\/assets/g, "(./assets");
          tips.push(`${fullSubPath} 完成 格式化:assets图片使用相对路径`);
        }

        // 格式化:简单代码框中文符号"·"替换成"`"
        if (/·(\w+)·/.test(content)) {
          content = content.replace(/·(\w+)·/g, "`$1`");
          tips.push(`${fullSubPath} 完成 简单代码框中文符号"·"替换成"\`"`);
        }

        // 格式化:url识别并转成markdown格式
        if (lineStartByURLRegExp.test(content)) {
          content = content.replace(urlGlobalRegExp, "$1[$2]($2)");
          tips.push(`${fullSubPath} 完成 格式化:url识别并转成markdown格式`);
        }

        fs.writeFileSync(fullSubPath, content);
      }
    });
  }
}

visit("");

if (tips.length) {
  tips.forEach((tip) => console.log("\x1B[31m%s\x1B[0m", tip));
  process.exit(1);
}
