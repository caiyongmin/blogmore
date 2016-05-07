/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path = require('path');
var gift = require('gift');
var fs = require('fs-extra');
var util = require('./util');
var CWD = process.cwd();

function getHomePath() {
    var platform = process.platform;
    return process.env[(platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = function () {
    var config = JSON.parse(fs.readFileSync(path.join(CWD, 'blogmore.json'), 'utf8'));
    var gitConfig = config.git;
    if (!gitConfig) {
        console.log('Git远程地址不能为空，请在 blogmore.json 文件中补充上'.red);
        return;
    }
    console.log('publish start...'.yellow);
    var gitDest = path.join(getHomePath(), '.blogmore');
    var repo = null;
    var PUBLISH_BRANCH = 'gh-pages';

    Promise
    .resolve(gitDest)
    .then(function () {
        // push 之前需要 build 整个项目
        console.log('build 项目文件'.yellow);
        return util.run('bm', ['build'], {
            cwd: CWD
        });
    })
    .then(function () {
        // push之前把远程仓库的代码克隆下来
        if (!fs.existsSync(path.join(gitDest, '.git'))) {
            console.log(('初始化克隆远程项目: git clone' + gitConfig + ' To ' + gitDest).yellow);
            return util.clone(gitConfig, gitDest);
        } else {
            return gift(gitDest);
        }
    })
    .then(function (r) {
        // repo 赋值
        repo = r;
        // 检查分支
        console.log('检查当前分支'.yellow);
        return util.getCurrentBranch(repo)
    })
    .then(function (branch) {
        // 切换分支
        if (branch.name != PUBLISH_BRANCH) {
            return util.getBranches(repo)
            .then(function (branches) {
                return branches.filter(function (branch) {
                    return branch.name === PUBLISH_BRANCH;
                }).length > 0;
            })
            .then(function (exists) {
                if (!exists) {
                    return util.createBranch(repo, PUBLISH_BRANCH);
                }
            })
            .then(function () {
                return util.checkoutBranch(repo, PUBLISH_BRANCH)
            })
        }
    })
    .then(function () {
        // 复制文件
        console.log('把要publish的文件复制到git项目中'.yellow);
        return util.copy(path.join(CWD, 'app'), gitDest);
    })
    .then(function () {
        // 添加文件
        console.log('缓存项目变更: git add --all'.yellow);
        return util.gitAddAll(repo);
    })
    .then(function () {
        // 提交文件
        console.log('提交项目变更: git commit -m "blogmore publish"'.yellow);
        return util.gitCommit(repo, 'blogmore publish');
    })
    .then(function () {
        // 同步远程分支
        console.log('同步远程分支'.yellow);
        return util.gitSync(repo, 'origin', PUBLISH_BRANCH);
    })
    .then(function () {
        // 提交到远程分支
        console.log('推送项目到远程: git push origin gh-pages'.yellow);
        return util.gitPush(repo, 'origin', PUBLISH_BRANCH);
    })
    .then(function () {
        console.log('publish success!'.green);
    })
    .catch(function (err) {
        console.log('publish failed: '.red + err.message.red);
        console.log(err.stack.red);
    })
};