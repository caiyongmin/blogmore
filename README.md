# blogmore

一个小型的博客构建工具。

[DEMO 页面](http://caiyongmin.github.io/blogmore_test/#/)

## 实现原理

借用 [commander.js](https://github.com/tj/commander.js) 的命令行功能，来对项目进行操作。对项目的操作包括 初始化、新建博客、构建博客、本地预览、发布博客。

- 初始化时，创建 source 文件夹用来存放创建的 markdown 文件。创建项目配置文件 blogmore.json。

- 新建博客时，根据博客模板新建一个 markdown 文件，放在 source 文件夹下。

- 构建博客时，创建 app 文件夹用来存放构建后的文件以及从 npm 包中复制过来的静态资源。之后的发布就是发布这个文件夹中的文件。构建过程主要是
把 markdown 文件转化成 html 文件，并提取里面的一些信息到 db.json 文件中用于页面展示。

- 本地预览利用 NodeJS 的 Koa 框架来启动项目，默认为 3000 端口。可以使用 `-p 或 --port [端口号]` 来指定端口启动。

- 发布时，把 app 文件夹下的静态文件 push 到 blogmore.json 文件配置的 GitHub 地址的 gh-pages 分支上，实现网上预览。

## 安装

由于 blogmore 这个 npm 包名已经被占了，还有这个包现在只是一个测试版，所以取了 blogmore.beta1 这个包名。

```bash
$ [sudo] npm install -g blogmore.beta1
```

## 初始化

```bash
$ bm init
```

## 新建博客

```bash
$ bm new -t [博客名称]
$ bm new --title [博客名称]
```

在 source 文件夹下根据博客初始模板新建一篇博客。

## 构建博客

```bash
$ bm build
```

## 本地预览

```bash
$ bm server
或
$ bm server -p [端口号]
$ bm server --port [端口号]
```

## 发布博客

发布前的要准备的事情:

在 Github 上建一个 repo。然后创建一个 gh-pages 的分支用来显示项目内容。到时候就是 publish 到这个分支。然后把这个 repo 的 Github 地址，复制给根目录下的 blogmore.json 文件的 git 字段。

```bash
$ bm publish
```

## 感谢

这个 repo 是参照[天镶](https://github.com/LingyuCoder)的[learnmore](https://github.com/ly-tools/learnmore)项目来写的。在此表示感谢！