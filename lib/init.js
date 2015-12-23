/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var util = require('./util');
var path = require('path');
var CWD = process.cwd();

module.exports = function () {
    console.log('开始在 ' + (CWD).yellow + ' 下构建博客仓库');
};