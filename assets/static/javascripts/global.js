/**
 * Created by caiyongmin on 15/12/20.
 */

angular
.module('blogApp', ['ngRoute'])
.service('existblogs', ['$http', function ($http) {

}])
.config(function ($routeProvider) {
    $routeProvider.when('/:blogname', {
        templateUrl: function (params) {
            return params.blogname + '.html';
        },
        controller: 'blogController'
    }).when('/:blogname', {
        template: function (params) {
            return '似乎没有 ' + params.blogname + ' 这篇文章o(╯□╰)o';
        },
        controller: 'blogController'
    }).otherwise({
        templateUrl: function (params) {
            return 'index.html';
        },
        controller: 'blogController'
    })
})
.controller('blogController', ['$scope', '$routeParams', '$location', 'existblogs',
    function ($scope, $routeParams, $location, existblogs) {

    }]);
