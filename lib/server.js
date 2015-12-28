/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var koa = require('koa');
var server = require('koa-static');
var argv = require('optimist').argv;
var exec = require('child_process').exec;

var port = argv.port || 80;
var url = 'http://127.0.0.1:' + port + '/assets/index.html';

var app = koa();
app.use(function * (next) {
    this.set('Access-Control-Allow-Origin', '*');
    yield next;
});
app.use(server('.'));
app.listen(port, function () {
    open(url);
});

console.log(('Server start at ' + url).green);

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
