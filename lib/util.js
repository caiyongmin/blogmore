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

/**
 * clone远程项目
 */
function clone(repo, dest) {
    return new Promise(function (resolve, reject) {
        gift.clone(repo, dest, function (err, repo) {
            if (err) {
                reject(err);
            } else {
                resolve(repo);
            }
        });
    })
}

/**
 * 获取当前分支
 */
function getCurrentBranch(repo) {
    console.log('getCurrentBranch'.yellow);
    return new Promise(function (resolve, reject) {
        repo.branch(function (err, branch) {
            if (err) {
                console.log('getCurrentBranch err'.red);
                reject(err);
            } else {
                resolve(branch);
            }
        })
    })
}

/**
 * 获取项目所有分支
 */
function getBranches(repo) {
    console.log('getBranches'.yellow);
    return new Promise(function (resolve, reject) {
        repo.branches(function (err, branches) {
            if (err) {
                reject(err);
            } else {
                resolve(branches);
            }
        })
    })
}

/**
 * 创建分支
 */
function createBranch(repo, name) {
    console.log('createBranch'.yellow);
    return new Promise(function (resolve, reject) {
        repo.create_branch(name, function (err, name) {
            if (err) {
                reject(err);
            } else {
                resolve(name);
            }
        })
    })
}

/**
 * 切换分支，切换分支前缓存更改
 */
function checkoutBranch(repo, name) {
    console.log('checkoutBranch'.yellow);
    return new Promise(function (resolve, reject) {
        repo.add('--all', function (err) {
            if (err) {
                reject(err);
            }
            repo.commit('commit changes', {}, function (err) {
                if (err) {
                    reject(err);
                }
                repo.checkout(name, function (err, name) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(name);
                    }
                });
            })
        });
    })
}

/**
 * 缓存项目变更
 */
function gitAddAll(repo) {
    console.log('gitAddAll'.yellow);
    return new Promise(function (resolve, reject) {
        repo.add('--all', function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

/**
 * 提交项目变更
 */
function gitCommit(repo, message, options) {
    options = options || {};
    console.log('gitCommit'.yellow);
    return new Promise(function (resolve, reject) {
        repo.commit(message, options, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

/**
 * 提交到远程分支，提交前先fetch远程分支
 */
function gitPush(repo, remote, branch) {
    console.log('gitPush'.yellow);
    return new Promise(function (resolve, reject) {
        repo.remote_push(remote, branch, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
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
    readFile: readFile,
    clone: clone,
    getCurrentBranch: getCurrentBranch,
    getBranches: getBranches,
    createBranch: createBranch,
    checkoutBranch: checkoutBranch,
    gitAddAll: gitAddAll,
    gitCommit: gitCommit,
    gitPush: gitPush
};