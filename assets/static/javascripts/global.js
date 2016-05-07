/**
 * Created by caiyongmin on 15/12/20.
 */

var blogModule = angular.module('blogApp', ['ngRoute']);

blogModule.service('blogData', ['$http', '$q',
    function ($http, $q) {
        var service = {
            returnedData: {},
            dataLoaded: {},
            getData: function (forceRefresh) {
                var dfd = $q.defer();
                if (!service.dataLoaded.genericData || forceRefresh) {
                    $http.get('db.json')
                    .then(function success(data) {
                        angular.copy(data.data, service.returnedData);
                        service.dataLoaded.genericData = true;
                        dfd.resolve(service.returnedData);
                    })
                } else {
                    dfd.resolve(service.returnedData);
                }
                return dfd.promise;
            },
            addSomeData: function (someDataToAdd) {
                $http.post('db.json', someDataToAdd)
                .then(function success(data) {
                    return service.getData(true);
                })
            }
        };
        service.getData();
        return service;
    }
]);

blogModule.service('utilFunc', ['$window',
    function (win) {
        return {
            dateToObj: function (date) {
                var arr = [];
                if (date.indexOf('-') > -1) {
                    arr = date.split('-');
                    return {
                        year: arr[0],
                        month: arr[1],
                        day: arr[2]
                    }
                } else if (date.length == 6) {
                    return {
                        year: date.substring(0, 4),
                        month: date.substring(4)
                    }
                } else if (date.length == 8) {
                    return {
                        year: date.substring(0, 4),
                        month: date.substring(4, 6),
                        day: date.substring(6)
                    }
                }
            },
            objToArr: function (obj) {
                var arr = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        arr.push(i);
                    }
                }
                return arr;
            },
            exist: function (_article, articles) {
                var _title = _article.title;
                var flag = false;
                articles.some(function (article, index) {
                    if (article.title == _title) {
                        flag = true;
                        return true;
                    }
                });
                return flag;
            },
            getPages: function (pageData) {
                var total = pageData.total;
                var size = pageData.size;
                var offset = pageData.offset;
                var pages = [];

                var current = Math.floor(offset / size) + 1;
                var totalPage = Math.ceil(total / size);
                var next = Math.min(totalPage, current + 1);
                var prev = Math.max(1, current - 1);
                var rightOffset = 0;
                var leftOffset = 0;
                var startPage = 0;
                var endPage = 0;
                if (total <= size) {
                    pages.push({
                        num: 1,
                        mark: true
                    })
                } else {
                    rightOffset = current > 3 ? Math.min(2, totalPage - current) : 5 - current;
                    leftOffset = Math.max(2, 4 - rightOffset);
                    startPage = Math.max(1, current - leftOffset);
                    endPage = Math.min(totalPage, (current + rightOffset));
                    for (var i = startPage; i <= endPage; i++) {
                        pages.push({
                            num: i,
                            mark: current == i ? true : false
                        })
                    }
                }
                return {
                    total: total,
                    size: size,
                    offset: offset,
                    current: current,
                    totalPage: totalPage,
                    next: next,
                    prev: prev,
                    pages: pages
                }
            }
        }
    }
]);

blogModule.config(function ($routeProvider) {
    $routeProvider
    .when('/index', {
        templateUrl: './static/partials/article-list.html',
        controller: 'blogController'
    })
    .when('/:title', {
        templateUrl: function (params) {
            return './_post/' + params.title + '.html';
        },
        controller: 'blogController'
    })
    .when('/:title/error', {
        template: function (params) {
            return '似乎没有 ' + params.title + ' 这篇文章o(╯□╰)o';
        },
        controller: 'blogController'
    }).otherwise({
        redirectTo: function () {
            return '/index';
        }
    })
});

blogModule.controller('blogController', ['$scope', '$routeParams', '$location', 'blogData', 'utilFunc',
    function ($scope, $routeParams, $location, blogData, utilFunc) {
        var getBlogData = {};
        var data = $scope.data = {};
        var dataCat = $scope.dataCat = {};
        var pagination = $scope.pagination = {};

        blogData.getData().then(function (returnedData) {
            getBlogData = returnedData;
            data.articles = getBlogData.articles;
            data.categories = getBlogData.categories;

            dataCat.category = utilFunc.objToArr(getBlogData.categories);
            dataCat.date = utilFunc.objToArr(getBlogData.dates);
            dataCat.tag = utilFunc.objToArr(getBlogData.tags);
            dataCat.datesObjArr = [];
            dataCat.date.forEach(function (date, index) {
                dataCat.datesObjArr.push(utilFunc.dateToObj(date));
            });

            pagination.size = 10;
            pagination.offset = 0;
            pagination.total = getBlogData.articles.length;
            var pageData = utilFunc.getPages(pagination);
            pagination.current = pageData.current;
            pagination.totalPage = pageData.totalPage;
            pagination.prev = pageData.prev;
            pagination.next = pageData.next;
            pagination.pages = pageData.pages;
            data.articlesPaged = data.articles.slice(pagination.offset, pagination.size);
        });

        $scope.jumpToPage = function (page) {
            pagination.offset = Math.max(page - 1, 0) * pagination.size;
            pagination.current = page;
            var pageData = utilFunc.getPages(pagination);
            pagination.totalPage = pageData.totalPage;
            pagination.prev = pageData.prev;
            pagination.next = pageData.next;
            pagination.pages = pageData.pages;
            pagination.offsetEnd = Math.min(page * pagination.size, pagination.total);
            data.articlesPaged = data.articles.slice(pagination.offset, pagination.offsetEnd);
            console.log(pagination);
            console.log(data.articlesPaged);
        };

        $scope.jumpToArticle = function (article) {
            if (utilFunc.exist(article, data.articles)) {
                $location.path('/' + article.title);
            } else {
                $location.path('/' + article.title + '/error');
            }
        };

        $scope.jumpToCat = function (category) {
            for (i in data.categories) {
                if (i == category) {
                    data.articles = data.categories[i];
                }
            }
        };

        $scope.$on('$routeChangeSuccess', function () {
            var cur = $location.path();
            console.log(cur);
            $scope.isArticle = (cur != '/index') ? true: false;
            jQuery('pre code').each(function (index, ele) {
                hljs.highlightBlock(ele);
            })
        })
    }
]);
