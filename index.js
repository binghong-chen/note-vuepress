const fs = require("fs");
const {
  BASE_PATH,
  exclude,
  lineStartByURLRegExp,
  lineStartByMarkDownURLRegExp,
} = require("./common");

let fileTotal = 0;
let wordsTotal = 0;
let todoTotal = 0;
let validMineFileTotal = 0;
let validUnMineFileTotal = 0;
let emptyBodyHeaderTotal = 0;

function isStartUrl(line) {
  return (
    lineStartByURLRegExp.test(line) || lineStartByMarkDownURLRegExp.test(line)
  );
}

const Colors = {
  error: "\x1B[31m%s\x1B[0m", // red
  warn: "\x1B[33m%s\x1B[0m", // yellow
  success: "\x1B[32m%s\x1B[0m", // green
};

function getHeaderLevel(line) {
  if (!line.startsWith("#")) return 0;
  const splits = line.split(" ");
  if (splits[0].match(/[^#]/)) return 0;
  return splits[0].length;
}

function checkHeader(path, head, bodyLineCount) {
  if (!bodyLineCount) {
    console.log(Colors.warn, `${path} ${head} 下没有正文内容`);
    emptyBodyHeaderTotal++;
    // 只是某个标题下正文内容为空，通过检测
    // return false;
  }
}

// check("./note/网络/原理/DNS.md");
function check(path, content) {
  content ||= fs.readFileSync(path, { encoding: "utf-8" });

  const todoMatch = content.match(/TODO/g);
  todoMatch && (todoTotal += todoMatch.length);

  // 非空行
  const lines = content.split("\n").filter((line) => line.trim().length);
  // 过滤空文章
  if (lines.filter((line) => !isStartUrl(line)).length <= 2) {
    console.log(Colors.error, `${path} 文章为空`);
    return false;
  }

  if (lines.filter((line) => line.startsWith("#")).length === 0) {
    console.log(Colors.error, `${path} 文章没有标题`);
    return false;
  }

  if (lines.length < 5) {
    console.log(
      Colors.error,
      `${path} 行数过少,未超过5行, 行数:${lines.length}`
    );
    return false;
  }

  if (lines.length < 20) {
    console.log(Colors.warn, `${path} 行数较少, 行数:${lines.length}`);
  }

  const wordsCount = lines.join("").length;
  wordsTotal += wordsCount;

  if (wordsCount < 100) {
    console.log(
      Colors.error,
      `${path} 字数过少,未达到100字,字数:${wordsCount}`
    );
    return false;
  }

  if (wordsCount < 200) {
    console.log(Colors.warn, `${path} 字数较少,字数:${wordsCount}`);
  }

  let isInCode = false;
  let prevHead = "";
  let prevHeadLevel = 0;
  let prevBodyLineCount = 0;
  for (let line of lines) {
    // 需要排除 代码中以 # 开头的 例如: ./note/网络/原理/DNS.md
    if (line.startsWith("```")) {
      isInCode = !isInCode;
      // 必须加上下面的 continue 否则 代码结束行 也算做 正文内容 （prevBodyLineCount）
      continue;
    }

    // 而且不计入行数 即 下面有空代码 也算作空
    if (isInCode) {
      prevBodyLineCount++;
      continue;
    }

    const level = getHeaderLevel(line);
    // level = 0 说明是 正文内容
    if (!level) {
      prevBodyLineCount++;
      continue;
    }

    if (prevHeadLevel >= level) {
      checkHeader(path, prevHead, prevBodyLineCount);
    }

    prevHead = line;
    prevHeadLevel = level;
    prevBodyLineCount = 0;
  }

  // 最后一个，也需要检测是否有 正文内容
  checkHeader(path, prevHead, prevBodyLineCount);

  if (!isStartUrl(content)) {
    console.log(Colors.success, `${path} 疑似原创文章,行数:${lines.length}`);
    validMineFileTotal++;
  } else {
    validUnMineFileTotal++;
  }

  return true;
}

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
        if (file === "README.md") return;
        fileTotal++;
        check(fullSubPath);
      }
    });
  }
}

if (!module.parent) {
  visit("");

  console.log("文章总数", fileTotal);
  console.log("文章总字数", wordsTotal);
  console.log("TODO总数", todoTotal);
  console.log("有效抄写文章数", validUnMineFileTotal);
  console.log("有效原创文章数", validMineFileTotal);
  console.log("正文内容为空的标题数", emptyBodyHeaderTotal);
}

module.exports = check;


// test case

// function testIsHeader(line) {
//   console.log(line, getHeaderLevel(line));
// }
// `
// #
// # 1
// ## 2
// ###3
// ### 3
// ## # 3
//  # 5
// `.split('\n').forEach(testIsHeader)
