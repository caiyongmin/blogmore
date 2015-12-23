/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var koa = require('koa');
var server = require('koa-static');
var argv = require('optimist').argv;
var exec = require('child_process').exec;

var port = argv.port || 80;

var app = koa();
app.use(function * (next) {
    this.set('Access-Control-Allow-Origin', '*');
    yield next;
});
app.use(server('.'));
app.listen(port, function () {
    open('http://127.0.0.1:' + port + '/assets/index.html');
});

console.log(('Server start at http://127.0.0.1:' + port).green);

function open(url) {
    switch (process.platform) {
        case 'darwin':
            exec('open ' + url);
            break;
        case 'win32':
            exec('start ' + url);
            break;
        default:
            spawn('xdg-open', [url]);
    }
}
