'use strict';

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('upload', {
        url: '/',
        templateUrl: 'parse/templates/uploadFile.tpl.html',
        controller: 'UploadFileController',
        controllerAs: 'upload'
    });
}]);