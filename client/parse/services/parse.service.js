'use strict';

app.service('ParseService', ParseService);

ParseService.$inject = ['$http'];

/* @ngInject */
function ParseService($http) {
    this.uploadFile = uploadFile;

    function uploadFile(file) {
        var fd = new FormData();
        fd.append('file', file);

        return $http.post(endpointsUrl.parse.parseFile,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }

}
