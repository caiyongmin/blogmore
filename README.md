# blogmore

一个小型的博客构建工具。

[DEMO 页面](http://caiyongmin.github.io/blogmore_test/#/)

## 实现原理

借用 [commander.js](https://github.com/tj/commander.js) 的命令行功能，来对项目进行操作。对项目的操作包括 初始化、新建博客、构建博客、本地预览、发布博客。

构建博客时，把 markdown 文件转化成 html 文件，提取里面的一些信息到 db.json 文件中用于页面展示。页面展示部分使用 angularjs 框架，利用它的 $http 服务来请求 db.json 中的数据，然后根据请求到数据来展示页面。

## 安装

```bash
$ [sudo] npm install -g blogmore
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
```

## 发布博客

发布前的要准备的事情:

在 Github 上建一个 repo。然后创建一个 gh-pages 的分支用来显示项目内容。到时候就是 publish 到这个分支。然后把这个 repo 的 Github 地址，复制给根目录下的 blogmore.json 文件的 git 字段。

```bash
$ bm publish
```

## 感谢

这个 repo 是参照[天镶](https://github.com/LingyuCoder)的[learnmore](https://github.com/ly-tools/learnmore)项目来写的~(搬了好多代码)。在此表示感谢！