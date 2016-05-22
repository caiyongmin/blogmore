#!/usr/bin/env node
/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var program   = require('commander');
var multiline = require('multiline');
var pkg       = require('./package.json');
var blogInit  = require('./lib/init');
var newBlog   = require('./lib/new');
var blogBuild = require('./lib/build');
var publish   = require('./lib/publish');
var startup   = require('./lib/startup');

function clog(str) {
    str = str || '';
    console.log(str);
}

program
.version(pkg.version);

program
.command('init')
.description('初始化构建项目，生成博客框架')
.action(function (props) {
    blogInit();
});

program
.command('new')
.description('指定标题新建博客，文件放在source文件夹里面')
.option('-t --title <title>', '需要新建的博客的标题')
.action(function (props) {
    newBlog(props.title);
});

program
.command('build')
.description('构建博客文件')
.action(function (props) {
    blogBuild();
});

program
.command('publish')
.description('提交博客项目文件到github上')
.action(function (props) {
    publish();
});

program
.command('server')
.description('启动本地服务')
.option('-p --port <port>', '指定端口号来启动本地服务')
.action(function (props) {
    startup(props.port);
});

program.parse(process.argv);
