/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var util = require('./util');
var path = require('path');
var CWD  = process.cwd();

module.exports = function () {
    console.log('开始在' + (CWD).yellow + '下构建博客仓库');
    util
    .mkdirs(path.join(CWD, 'source'))
    .then(function () {
        return util.copy(path.join(__dirname, '../assets', 'init.json'), path.join(CWD, 'blogmore.json'))
    })
    .then(function () {
        console.log('初始化构建博客项目成功'.green);
    })
    .catch(function (err) {
        console.log('初始化构建博客项目失败'.red);
        console.log(err.message.red);
        console.log(err.stack.red);
    })
};