var xlsx = require('XLSX');
const fs = require('fs');

module.exports = {
    parseFile: function(req, res) {
        console.log("Body", req.file);
        var fileObject = xlsx.readFile(req.file.path);
        var sheetNameList = fileObject.SheetNames;
        var jsonData = xlsx.utils.sheet_to_json(fileObject.Sheets[sheetNameList[0]], {header: "A"});
        var parsedData = {
            tableHeadData: [],
            tableData: [],
            occupancyData: []
        };
        var occupancy = false;
        var occupancyRow = 0;
        var tableSubHeadObj = [];
        var tableMainDataCount = 0;
        var buildingName = "";
        var occupancyDataHead = ['type'];
        var occupancyDataCheck = false;
        var mainTableHead = [];
        var mainTableHeadCount = 0;
        var attachMain = true;

        for(var row in jsonData) {
            var addData = false;
            var addOccupancyData = false;
            var tableMainData = false;
            var tableSubData = false;
            var rowData = jsonData[row];
            var tableDataRec = {};
            var occupancyDataRec = [];
            var thisOccupancy = {};
            var occupancyType = 0;
            var occupancyDataCount = 0;
            var occupancyDataType = "";

            Object.keys(rowData).forEach(function(cell, cellCount) {
                var trimData = rowData[cell].trim();
                trimData = trimData.replace("\r\n", "");
                if(parseInt(row) === 0) {
                    parsedData.fileType = trimData;
                    addData = false;
                } else if(parseInt(row) === 1) {
                    parsedData.building = trimData;
                    var buildingSplit = trimData.split("(");
                    buildingSplit = buildingSplit[1];
                    buildingSplit = buildingSplit.replace(")", "");
                    buildingName = buildingSplit;
                    console.log("Build", buildingName);
                    addData = false;
                } else if(parseInt(row) === 2) {
                    parsedData.timeSpan = trimData;
                    addData = false;
                } else if(parseInt(row) === 3) {
                    parsedData.createdOn = trimData;
                    addData = false;
                } else if(parseInt(row) === 4) {
                    var headObj = {};
                    headObj.val = trimData;
                    headObj.data = [];
                    parsedData.tableHeadData.push(headObj);
                    mainTableHead.push(trimData);
                    if(cell === 'U') {
                        var headObj = {};
                        headObj.val = 'other';
                        headObj.data = [];
                        parsedData.tableHeadData.push(headObj);
                        mainTableHead.push('other');
                    }
                    addData = false;
                } else if(parseInt(row) === 5) {
                    var attachData = "";
                    if(cell === 'H' || cell === 'O' || cell === 'Q' || cell === 'S' || cell === 'U' || cell === 'W' || cell === 'AA') {
                        mainTableHeadCount++;
                        attachMain = true;
                    }

                    attachData = mainTableHead[mainTableHeadCount] + "_" + trimData;

                    var subHeadObj = {};
                    subHeadObj.cell = cell;
                    subHeadObj.val = attachData;
                    tableSubHeadObj.push(subHeadObj);
                    parsedData.tableHeadData[mainTableHeadCount].data.push(trimData);
                    addData = false;
                } else {
                    if(trimData === "Physical Occupancy" || occupancy === true) {
                        occupancy = true;
                        addData = false;
                        if(occupancyRow === 0) {
                            parsedData.occupancyData.push({type: trimData, data: []});
                            console.log(parsedData.occupancyData);
                        } else if(occupancyRow === 1) {
                            if(!occupancyDataCheck) {
                                if(cell === 'E') {
                                    trimData = 'o' + trimData;
                                } else if(cell === 'G') {
                                    trimData = 'v' + trimData;
                                }
                                occupancyDataHead.push(trimData);
                                if(cell === 'H') {
                                    occupancyDataCheck = true;
                                }
                            }

                        } else if(occupancyRow > 1) {
                            if(cellCount === 0) {
                                occupancyDataType = trimData;
                            }
                            if(cell === 'H') {
                                parsedData.occupancyData[occupancyType].data.push(thisOccupancy);
                                thisOccupancy = {type: occupancyDataType};
                                occupancyType = 1;
                                occupancyDataCount = 1;
                            }

                            thisOccupancy[occupancyDataHead[occupancyDataCount]] = trimData;
                            occupancyDataCount++;
                            addOccupancyData = true;
                        }
                    } else {
                        if(tableSubHeadObj.length > 0) {
                            if(cell === "A") {
                                if(trimData.indexOf("(") !== -1 || trimData.indexOf("Vacant") !== -1 || trimData.indexOf(buildingName) !== -1) {
                                    tableMainData = true;
                                    tableDataRec.subData = [];
                                } else {
                                    tableSubData = true;
                                }
                            }  else {
                                tableSubData = true;
                            }
                            for(var sh in tableSubHeadObj) {
                                if(tableSubHeadObj[sh].cell === cell) {
                                    tableDataRec[tableSubHeadObj[sh].val] = trimData;
                                    addData = true;
                                } else {
                                    if(tableDataRec[tableSubHeadObj[sh].val] === undefined) {
                                        tableDataRec[tableSubHeadObj[sh].val] = "";
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if(occupancy === true) {
                occupancyRow++;
                if(addOccupancyData) {
                    parsedData.occupancyData[occupancyType].data.push(thisOccupancy);
                }
            }
            if(addData) {
                if(tableMainData === true) {
                    parsedData.tableData.push(tableDataRec);
                    tableMainDataCount++;
                } else if(tableSubData === true) {
                    parsedData.tableData[tableMainDataCount-1].subData.push(tableDataRec);
                }
            }
        }
        fs.unlink(req.file.path);
        res.send(parsedData);
    },
}