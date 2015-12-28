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
                    $http.get('../app/db.json')
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
                $http.post('../app/db.json', someDataToAdd)
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
            dateToObjArr: function (date) {
                var arr = date.split('-');
                return {
                    year: arr[0],
                    month: arr[1],
                    day: arr[2]
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
            }
        }
    }
]);

blogModule.config(function ($routeProvider) {
    $routeProvider.when('/:title', {
        templateUrl: function (params) {
            console.log(params);
            return params.title + '.html';
        },
        controller: 'blogController'
    }).when('/:title/error', {
        template: function (params) {
            console.log(params);
            return '似乎没有 ' + params.title + ' 这篇文章o(╯□╰)o';
        },
        controller: 'blogController'
    }).otherwise({
        templateUrl: function (params) {
            return 'index.html';
        },
        controller: 'blogController'
    })
});

blogModule.controller('blogController', ['$scope', '$routeParams', '$location', 'blogData', 'utilFunc',
    function ($scope, $routeParams, $location, blogData, utilFunc) {
        var getBlogData;
        blogData.getData().then(function (returnedData) {
            getBlogData = returnedData;
            var articles = $scope.articles = getBlogData.articles;
            var dates = $scope.dates = utilFunc.objToArr(getBlogData.dates);
            var categories = $scope.categories = utilFunc.objToArr(getBlogData.categories);
            var tags = $scope.tags = utilFunc.objToArr(getBlogData.tags);

            var datesObjArr = $scope.datesObjArr = [];
            dates.forEach(function (date, index) {
                datesObjArr.push(utilFunc.dateToObjArr(date));
            });

            $scope.jumpToArticle = function (article) {
                if (utilFunc.exist(article, articles)) {
                    console.log('ok');
                    $location.path('/' + article.title);
                } else {
                    console.log('error');
                    $location.path('/' + article.title + '/error');
                }
            };

            console.log(getBlogData);
        });
    }
]);
