/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path   = require('path');
var _      = require('lodash');
var moment = require('moment');
var util   = require('./util');
var CWD    = process.cwd();

var template = _.template('title: <%= title %>\ndate: <%= date %>\ncategory: \ntags: \n---');

module.exports = function (title) {
    if (!title) {
        console.log('新建失败，标题不能为空'.red);
        return;
    }
    Promise
    .resolve(title)
    .then(function parseTitle(title) {
        return new Promise(function (resolve, reject) {
            var nowDay = new Date();
            nowDay     = moment(nowDay).format('YYYY-MM-DD HH:mm:ss');
            resolve({
                date: nowDay,
                title: title
            })
        })
    })
    .then(function (data) {
        console.log('开始新建' + (data.title).green + '这篇文章.');
        var fileName = path.join(CWD, 'source', data.title + '.md');
        var fileData = template(data);
        return util.createFile(fileName, fileData);
    })
    .then(function () {
        console.log('新建成功'.green);
    })
    .catch(function (err) {
        console.log(err.message.red);
    })
};