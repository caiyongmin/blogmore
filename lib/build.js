/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');
var markdown = require('markdown-it')().use(require('markdown-it-checkbox'));

var util = require('./util');
var CWD = process.cwd();

module.exports = function () {
   console.log('开始构建博客md文件'.green);
};