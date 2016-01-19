/**
 * Created by caiyongmin on 15/12/20.
 */

require('colors');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var path = require('path');
var fs = require('fs-extra');
var markdown = require('markdown-it')().use(require('markdown-it-checkbox'));
var pkg = require('../package.json');

var util = require('./util');
var CWD = process.cwd();
var DB = {};
DB['articles'] = [];
DB['dates'] = {};
DB['categories'] = {};
DB['tags'] = {};

function makeBlogDB(source, title, date, categories, tags) {
    categories = util.strToArr(categories);
    tags = util.strToArr(tags);
    date = util.dataNoTime(date);
    console.log(date);
    DB['articles'].push({
        title: title,
        source: source,
        date: date,
        categories: categories,
        tags: tags
    });
    var dateCat = util.substrDate(date);
    DB['dates'][dateCat] = DB['dates'][dateCat] || [];
    DB['dates'][dateCat].push({
        title: title,
        source: source,
        date: date,
        categories: categories,
        tags: tags
    });
    categories.forEach(function (category, index) {
        DB['categories'][category] = DB['categories'][category] || [];
        DB['categories'][category].push({
            title: title,
            source: source,
            date: date,
            categories: categories,
            tags: tags
        })
    });
    tags.forEach(function (tag, index) {
        DB['tags'][tag] = DB['tags'][tag] || [];
        DB['tags'][tag].push({
            title: title,
            source: source,
            date: date,
            categories: categories,
            tags: tags
        })
    });
}

module.exports = function () {
    console.log('开始构建博客文件'.green);
    var indexHTML = '';
    var blogmoreJSON = '';
    try {
        indexHTML = fs.readFileSync(path.join(__dirname, '../assets', 'index.html'), 'utf8');
        blogmoreJSON = fs.readFileSync(path.join(CWD, 'blogmore.json'), 'utf8');
    } catch (err) {
        console.log(err.message.red);
        console.log('构建博客文件失败'.red);
        return;
    }
    var template = _.template(indexHTML);
    var dest = path.join(CWD, 'app');
    var postDest = path.join(dest, '_post');
    Promise
    .resolve(dest)
    .then(util.mkdir)
    .then(util.mkdir(postDest))
    .then(function () {
        return util.readDir(path.join(CWD, 'source'));
    })
    .then(function (files) {
        return Promise.all(files.map(function (file) {
            console.log('building: ' + file.name.green);
            return util.readFile(file.path).then(function (content) {
                var title = file.name.replace(/\.md$/, '');
                var contentObj = util.parseContent(content);

                makeBlogDB(path.join('_post', title + '.html'), title, contentObj.date, contentObj.categories, contentObj.tags);
                return util.createFile(path.join(postDest, title + '.html'), markdown.render(contentObj._content));
            })
        }))
    })
    .then(function () {
        return util.createFile(path.join(dest, 'db.json'), JSON.stringify(DB));
    })
    .then(function () {
        console.log('博客构建完毕'.green);
        console.log('开始创建资源文件'.green);
        return util.createFile(path.join(dest, 'index.html'), template(JSON.parse(blogmoreJSON)));
    })
    .then(function () {
        return util.copy(path.join(__dirname, '../assets', 'static'), path.join(dest, 'static'));
    })
    .then(function () {
        console.log('创建资源文件完成'.green);
    })
    .catch(function (err) {
        console.log(err.stack.red);
        console.log(err.message.red);
    });
};