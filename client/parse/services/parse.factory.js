'use strict';

app.factory('ParseFactory', ParseFactory);

ParseFactory.$inject = ['ParseService', '$rootScope', '$q'];


/* @ngInject */
function ParseFactory(ParseService, $rootScope, $q) {

    var service = {

    };

    service.parsedData = {};

    service.uploadFile = uploadFile;

    function uploadFile(file) {
        var deferred = $q.defer();
        ParseService.uploadFile(file).then(function(data) {
            var parsed_data = data.data;
            parsed_data.tableSubHead = [];
            for(var th in parsed_data.tableHeadData) {
                for(var tsh in parsed_data.tableHeadData[th].data) {
                    var addSubHead = true;
                    if(parseInt(th) === 0 && parseInt(tsh) === 0) {
                        parsed_data.tableHeadData[th].data[tsh] = "Corp";
                    } else if(parseInt(th) === 1 && parsed_data.tableHeadData[th].data[tsh] === "SquareFeet") {
                        addSubHead = false;
                    }
                    if(addSubHead) {
                        parsed_data.tableSubHead.push(parsed_data.tableHeadData[th].data[tsh]);
                    }
                }
            }

            for(var td in parsed_data.tableData) {
                parsed_data.tableData[td].mainData = [];
                var mainData = [];
                Object.keys(parsed_data.tableData[td]).forEach(function(cell, cellCount) {
                    if(parseInt(cellCount) !== 0) {
                        mainData.push(parsed_data.tableData[td][cell]);
                    }
                });
                delete mainData[mainData.length - 1];
                mainData.filter(function(e){return e});
                parsed_data.tableData[td].mainData = mainData;
                for(var tds in parsed_data.tableData[td].subData) {
                    parsed_data.tableData[td].subData[tds].mainSubData = [];
                    var mainSubData = [];
                    Object.keys(parsed_data.tableData[td].subData[tds]).forEach(function(subCell, subCellCount) {
                        mainSubData.push(parsed_data.tableData[td].subData[tds][subCell]);
                    });
                    delete mainSubData[mainSubData.length - 1];
                    mainSubData.filter(function(e){return e});
                    parsed_data.tableData[td].subData[tds].mainSubData = mainSubData;
                }
            }
            deferred.resolve(parsed_data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    return service;

}