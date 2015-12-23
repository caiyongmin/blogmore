/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path = require('path');
var _ = require('lodash');
var util = require('./util');
var CWD = process.cwd();

module.exports = function (title) {
    if (!title) {
        console.log('新建失败，标题不能为空'.red);
    } else {
        console.log('新建"' + (title).green + '"文章成功');
    }
};