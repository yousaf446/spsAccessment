'use strict';

app.controller('UploadFileController', UploadFileController);

UploadFileController.$inject = ['$scope', '$rootScope', 'ParseFactory', '$mdDialog'];

/* @ngInject */
function UploadFileController($scope, $rootScope, ParseFactory, $mdDialog) {

    var vm = this;

    vm.exlFile = [];
    vm.showFileData = false;
    vm.showError = false;
    vm.fileData = {};

    vm.uploadFile = uploadFile;

    function uploadFile() {
        vm.showFileData = false;
        vm.showError = false;
        $rootScope.loader = true;
        ParseFactory.uploadFile(vm.exlFile[0].lfFile).then(function(data) {
            $rootScope.loader = false;
            vm.fileData = data;
            vm.showFileData = true;
        }, function(data) {
            $rootScope.loader = false;
            vm.showFileData = false;
            vm.showError = true;
        });
    }



}