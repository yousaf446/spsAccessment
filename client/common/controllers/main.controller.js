'use strict';

app.controller('MainController', MainController);

MainController.$inject = ['$scope', '$rootScope'];

/* @ngInject */
function MainController($scope, $rootScope) {

    var vm = this;
    vm.loader = false;

    $rootScope.$watch('loader', function () {
        vm.loader = $rootScope.loader;
    }, false);

}