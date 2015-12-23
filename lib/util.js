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

module.exports = {
    run: run
};