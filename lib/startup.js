/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var path = require('path');
var util = require('./util');
var CWD  = process.cwd();

module.exports = function (port) {
    var args = ['--harmony', path.join(__dirname, 'server.js'), '--port', port || 3000];

    util
    .run('bm', ['build'], {
        cwd: CWD
    })
    .then(function () {
        return util.run('node', args, {
            env: process.env,
            cwd: CWD,
            stdio: [
                process.stdin,
                process.stdout,
                process.stderr
            ]
        });
    })
    .then(function (code) {
        process.exit(code);
    })
    .catch(function (err) {
        console.log(err.message.red);
        console.log(err.stack.red);
    })
};