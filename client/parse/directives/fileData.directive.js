"use strict";

app.directive("fileData", fileData);

function fileData() {
    var directive = {
        restrict: 'E',
        controller: FileDataController,
        controllerAs: "fileData",
        scope: {
            parseData: '='
        },
        templateUrl: "parse/templates/fileData.tpl.html"
    };

    return directive;

    FileDataController.$inject = ["$scope"];

    /* @ngInject */
    function FileDataController($scope) {
        var vm = this;

        vm.parsedData = $scope.parseData;
    }
}
