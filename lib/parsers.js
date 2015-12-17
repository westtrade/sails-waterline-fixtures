'use strict';

var _ = require('lodash');


function defaultParserFunction(moduleName) {

    return function () {
        var resultObject = {};
        console.error('Module ' + moduleName + ' is not found. Install module "npm i ' + moduleName + ' --save-dev"');
        return resultObject;
    };
}




var funcRegExp = /function[^(]*[(]([^)]*)[)][^{]*[{]([^}]*)[}]/gim;

function reqursiveMapFunction(dataObject) {

    if (_.isString(dataObject) && funcRegExp.test(dataObject)) {

        return eval.call(null, '(' + dataObject + ')');
    }

    if (_.isArray(dataObject) || _.isObject(dataObject)) {

        dataObject.forEach(function (value, objectKey, dataObject) {
            dataObject[objectKey] = reqursiveMapFunction(value);
        });
    }

    return dataObject;
}


module.exports.list = {};

function addParser(ext, moduleName, parserFunction) {
    try {

        var parserModule = moduleName === 'JSON' ? global[moduleName] : require.resolve(moduleName);

        module.exports.list[ext] = function (rawData) {

            var resultObject = {};

            try {
                resultObject = parserFunction(parserModule, rawData);
            } catch (err) {
                console.error(err);
            }

            return resultObject;
        };

    } catch (e) {
        module.exports.list[ext] = defaultParserFunction(moduleName);
    }
}

addParser('json', 'JSON', function (JSON, rawData) {
    return JSON.parse(rawData);
});

addParser('jsongen', 'jsongen', function (jsongen, rawData) {

    var resultObject = JSON.parse(rawData);
    resultObject = reqursiveMapFunction(resultObject);
    resultObject = jsongen(resultObject);

    return resultObject;
});

addParser('cson', 'cson', function (CSON, rawData) {
    var resultObject = CSON.parseCSONString(rawData);
    return resultObject;
});

addParser('json5', 'json5', function (JSON5, rawData) {
    var resultObject = JSON5.parse(rawData);
    return resultObject;
});

addParser('yaml', 'yaml', function (YAML, rawData) {
    var resultObject = YAML.eval(rawData);
    return resultObject;
});


module.exports.addParser = addParser;