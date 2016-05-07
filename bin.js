#!/usr/bin/env node
/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var program = require('commander');
var multiline = require('multiline');
var pkg = require('./package.json');
var blogInit = require('./lib/init');
var newBlog = require('./lib/new');
var blogBuild = require('./lib/build');
var publish = require('./lib/publish');
var startup = require('./lib/startup');

function clog(str) {
    str = str || '';
    console.log(str);
}

program
.version(pkg.version)
.usage(multiline(function () {
    /*
    [command] [option]
     */
}));

program
.command('init')
.usage(multiline(function () {
    /*

    初始化构建项目，生成博客框架

    example:

    $bm init

     */
}))
.description('初始化构建项目，生成博客框架')
.action(function (props) {
    blogInit();
});

program
.command('new')
.usage(multiline(function () {
    /*

    新建博客，可使用-t或者--title来指定博客的标题，不输入标题会创建失败。文件放在source文件夹里面。

    example:

    $bm new -t 新的博客
    or
    $bm new -title 新的博客

     */
}))
.description('指定标题新建博客，文件放在source文件夹里面')
.option('-t --title <title>', '需要新建的博客的标题')
.action(function (props) {
    newBlog(props.title);
});

program
.command('build')
.usage(multiline(function () {
    /*

    构建博客md文件，并记录一些数据存进db.json文件中。构建得到的html文件放入_post文件夹中

    example:

    $bm build

     */
}))
.description('构建博客文件')
.action(function (props) {
    blogBuild();
});

program
.command('publish')
.usage(multiline(function () {
    /*

    将博客项目文件push到blogmore.json文件中git字段指定的仓库中

    example:

    $bm publish

     */
}))
.description('提交博客项目文件到github上')
.action(function (props) {
    publish();
});

program
.command('server')
.usage(multiline(function () {
    /*

    启动本地服务，默认4000端口，也可使用-p或者--port来指定端口号

    example:

    $bm server

    or

    $bm server -p 3000
    $bm server -port 3000
     */
}))
.description('启动本地服务')
.option('-p --port <port>', '指定端口号来启动本地服务')
.action(function (props) {
    startup(props.port);
});

program.parse(process.argv);
