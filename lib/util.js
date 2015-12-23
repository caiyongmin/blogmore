/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path = require('path');
var fs = require('fs-extra');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var spawn = require('child_process').spawn;
var gift = require('gift');

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
 * 根据路径创建文件夹
 **/
function mkdirs(path) {
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
 * 根据复制文件
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

module.exports = {
    run: run,
    mkdirs: mkdirs,
    copy: copy
};