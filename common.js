const BASE_PATH = module.path + "/note";

// 暂时排除的菜单
const exclude = [".git", ".vuepress", ".gitignore", ".DS_Store", "assets"];

const urlRegExpStr =
  "(https?|ftp|file):\\/\\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";
const lineStartByURLRegExp = new RegExp(`(\\n\\s*)(${urlRegExpStr})`); // https://www.baidu.com
const lineStartByMarkDownURLRegExp = new RegExp(
  `(\\n\\s*)\\[${urlRegExpStr}\\]`
); // [https://www.baidu.com]

module.exports = {
  BASE_PATH,
  exclude,
  lineStartByURLRegExp,
  lineStartByMarkDownURLRegExp,
};
