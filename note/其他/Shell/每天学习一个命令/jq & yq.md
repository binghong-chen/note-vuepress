# jq & yq

## jq



### MACOS安装

```sh
brew install jq
```

### CentOS安装

```sh
yum install jq
```

### 实践

```sh
jq . package.json
{
  "name": "note-vuepress",
  "version": "1.0.0",
  "description": "",
  "main": "note/.vuepress/config.js",
  "scripts": {
    "dev": "vuepress dev note",
    "check": "node .",
    "build": "vuepress build note"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "vuepress": "^1.9.8"
  }
}
```

```sh
curl 'https://api.github.com/repos/stedolan/jq/commits?per_page=5' | jq -r '.[0] | .commit .committer .email'

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 19313  100 19313    0     0   9288      0  0:00:02  0:00:02 --:--:--  9316
nico@cryptonector.com
```

## yq

### MacOS安装

```sh
brew install yq
```

### CentOS安装

yum 无法找到 yq

```sh
yum install yq
已加载插件：fastestmirror
Loading mirror speeds from cached hostfile
没有可用软件包 yq。
错误：无须任何处理
```

使用wget下载安装

```sh
wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/bin/yq &&\
    chmod +x /usr/bin/yq
```

### 实践

```sh
yq CICD.yml
name: CI
on: push
# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "greet"
  ci:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: "Install and Build \" # This example project is built using npm and outputs the result to the 'build' folder. Replace with the commands required to build your project, or remove this step entirely if your site is pre-built.
        run: |
          cd note/.vuepress
          npm install
          cd ../..
          npm install   # 安装依赖
          npm run build # 执行打包
      # 部署到服务器
      - name: Deploy
        uses: easingthemes/ssh-deploy@v2.1.5
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }} # 服务器的key
          ARGS: "-avz --delete" # rsync 参数   https://einverne.github.io/post/2017/07/rsync-introduction.html
          SOURCE: note/.vuepress/dist # 这是要复制到服务器的文件夹名称
          REMOTE_HOST: ${{ secrets.DR_HOST }} # 你的服务器公网地址
          REMOTE_PORT: ${{ secrets.DR_PORT }} # 你的服务器公网端口
          REMOTE_USER: ${{ secrets.DR_USER }} # 服务器登录用户名
          TARGET: ${{ secrets.DR_TARGET }} # 放到的目标地址
          
          
yq '.jobs .ci .steps .[2] .env .SOURCE' CICD.yml
note/.vuepress/dist
```

