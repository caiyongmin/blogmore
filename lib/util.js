/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var moment = require('moment');
var spawn = require('child_process').spawn;
var gift = require('gift');
var pkg = require('../package.json');

/**
 * 把字符串转化成数组，并且去除每个数组项的前后空格
 */
function strToArr(str) {
    var newArr = [];
    str = str.split(',');
    str.forEach(function (item, index) {
        item = item.replace(/(^\s*)|(\s*$)/g, '');
        newArr.push(item);
    });
    return newArr;
}

/**
 * 去掉日期的时分秒
 */
function dataNoTime(date) {
    return moment(date).format('YYYY-MM-DD');
}

/**
 * 去掉日期中的横杠，并且提取里面的年月信息
 */
function substrDate(date) {
    return date.replace(/(^\s*)|-|(\s*$)/g, '').substring(0, 6);
}

/**
 * 解析md文件的内容，返回一个对象
 */
function parseContent(content) {
    var contentIndex = content.indexOf('---');
    var dateIndex = content.indexOf('date:');
    var categoryIndex = content.indexOf('category:');
    var tagsIndex = content.indexOf('tags:');

    var date = content.substring(dateIndex, categoryIndex);
    var categories = content.substring(categoryIndex, tagsIndex);
    var tags = content.substring(tagsIndex, contentIndex);
    var _content = content.substring(contentIndex).replace(/^---/,'');
    date = date.replace(/(^\s*)|(\s*$)/g,'').replace('date:', '');
    categories = categories.replace(/(^\s*)|(\s*$)/g,'').replace('category:', '');
    tags = tags.replace(/(^\s*)|(\s*$)/g,'').replace('tags:', '');

    return {
        date: date,
        categories: categories,
        tags: tags,
        _content: _content
    }
}

/**
 * 运行node命令
 **/
function run(command, args, options) {
    return new Promise(function (resolve, reject) {
        var task = spawn(command, args, options);
        task.on('close', function (code) {
            if (code !== 0) {
                reject(new Error(command + ' process exit with code ' + code));
            } else {
                resolve();
            }
        })
    })
}

/**
 * 根据单个路径创建单个文件夹
 **/
function mkdir(path) {
    return new Promise(function (resolve, reject) {
        mkdirp(path, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(path);
            }
        })
    })
}

/**
 * 根据路径数组创建多个文件夹
 **/
function mkdirs(paths) {
    if (!Array.isArray(paths)) {
        paths = [paths];
    }
    return Promise.all(paths.map(function (path) {
        return mkdir(path);
    }))
}

/**
 * 复制文件
 **/
function copy(src, dest) {
    return new Promise(function (resolve, reject) {
        fs.copy(src, dest, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

/**
 * 创建文件
 **/
function createFile(fileName, date) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fileName, date, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(fileName);
            }
        })
    })
}

/**
 * 读取文件夹下的md文件，包括子目录的
 */
function readDir(path) {
    // console.log(path);
    return new Promise(function (resolve, reject) {
        if (!fs.existsSync(path)) {
            reject(path + ' 不存在');
        }
        var stat = fs.statSync(path);
        if (!stat || !stat.isDirectory()) {
            reject(path + ' 不是一个文件夹');
        }

        Promise
        .resolve(path)
        .then(walk)
        .then(resolve)
        .catch(reject);
    })
}
function walk(floder) {
    return new Promise(function (resolve, reject) {
        fs.readdir(floder, function (err, files) {
            if (err) {
                return reject(err);
            } else {
                Promise.all(files.map(function (file) {
                    var filePath = path.join(floder, file);
                    var stat = fs.statSync(filePath);
                    if (stat && stat.isFile()) {
                        return Promise.resolve({
                            name: file,
                            path: filePath
                        });
                    } else {
                        return walk(filePath); // 计算子目录里面的文件
                    }
                }))
                .then(function (files) {
                    var result = [];
                    files.forEach(function (file, index) {
                        if (Array.isArray(file)) {
                            result.concat(file);
                        } else {
                            result.push(file);
                        }
                    });
                    // 找到里面的md文件
                    result.filter(function (ele) {
                        return /\.md$/.test(ele);
                    });
                    resolve(result);
                })
                .catch(reject);
            }
        })
    })
}

/**
 * 读取文件内容
 */
function readFile(path) {
    // console.log(path);
    return new Promise(function (resolve, reject) {
        fs.readFile(path, 'utf-8', function (err, content) {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        })
    })
}

module.exports = {
    strToArr: strToArr,
    substrDate: substrDate,
    parseContent: parseContent,
    dataNoTime: dataNoTime,
    run: run,
    mkdir: mkdir,
    mkdirs: mkdirs,
    copy: copy,
    createFile: createFile,
    readDir: readDir,
    readFile: readFile
};