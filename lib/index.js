'use strict';

var _ = require('lodash');
var chokidar = require('graceful-chokidar');
var path = require('path');
var fs = require('fs');

var Finder = require('fs-finder');

if (typeof Promise !== 'function') {
    var Promise = require('promise');
}


function promisedReadFile(path, codec) {
    codec = codec || 'utf8';
    return new Promise(function (resolve, reject) {
        fs.readFile(path, codec, function (err, content) {
            return err ? reject(err) : resolve(content);
        });
    });
}


/**
 * Default module settings
 * 
 * @param { string }    dir Folder  where fixtures placed
 * @param { boolean }   reloadOnChange Hot reload fixtures
 * @param { boolean }   updateOnRestart Update data on fixtures reload, if false fixtures has error, on double id
 * @param { boolean }   purgeOnReload Purge model on fixtures reloaded
 * @param { boolean }   preventOnProduction Prevent run fixtures in production server
 * @param { [string, RegExp] }  pattern Folder  where fixtures placed
 * 
 * @type {Object}
 */
var defaultSettings = {
    dir: 'fixtures',
    reloadOnChange: true, //Dir watcher for livereload 
    updateOnRestart: true,
    purgeOnReload: false,
    preventOnProduction: true,
    formats: null // ['json'], // ['json', 'cson', 'json5', 'jsongen', 'yaml'] defaults list generates by exists parsers
};

var WaterlineFixtures = function (settings) {

    if (settings) {
        this.setSettings(settings);
    }
};

var Parsers = require('./parsers');

WaterlineFixtures.prototype.parsers = Parsers;
WaterlineFixtures.prototype.defaultSettings = defaultSettings;


/**
 * Function initializes fixtures
 * 
 * @param  { [object, function] } settings    ettings object overrides  default settings list, or callback of loading fixtures is done 
 * @param  { function } loadingDone callback of loading fixtures is done 
 * @return { Promise } indicator of fixtures loading status
 */
WaterlineFixtures.prototype.run = function (settings) {

    return new Promise(function (resolve) {

        if (process.env.NODE_ENV === 'production') {
            return resolve(null);
        }

        if (_.isObject(settings)) {
            this.setSettings(settings);
        }

        return true;
    });
};

/**
 * Set fixture settings
 * 
 * @param {[type]} settingsName [description]
 * @param {[type]} settingValue [description]
 */
WaterlineFixtures.prototype.setSettings = function (settingsName, settingValue) {

    if (arguments.length === 2) {
        return module.exports.settings[settingsName] = settingValue;
    }

    var setting = _.isObject(arguments[0]) ? arguments[0] : {};
    module.exports.settings = _.defaults(setting, module.exports.settings);

    return this.settings;
};



/**
 * get Fixture Path info
 * 
 * @param  {[object, string]} settings Settings or glob path
 * @return { object } return object, representing of fixture path, with keys 
 * directory - full path to directory, where fixtures placed,
 * pattern - glob file types pattern,
 * path - full glob path
 * 
 */
WaterlineFixtures.prototype.getFixturePath = function (settings) {

    var result = {};

    if (_.isString(arguments[0])) {
        var pathInfo = path.parse(arguments[0]);

        console.log(pathInfo);

        result.pattern = pathInfo.base;
        result.dir = pathInfo.dir;
    } else {

        settings = _.isObject(settings) ?
            _.defaults(settings, defaultSettings) :
            defaultSettings;


        if (!settings.formats) {
            settings.formats = Object.keys(Parsers.list);
        }

        if (!_.isArray(settings.formats)) {
            settings.formats = [settings.formats];
        }

        var pattern = '*.<(' + settings.formats.join('|') + ')$>';
        result.dir = path.resolve(process.cwd(), settings.dir);
        result.pattern = pattern;
    }

    console.log(result);


    return result;
};

WaterlineFixtures.prototype.getAllFixtures = function (settings) {

    var me = this;
    var globPath = me.getFixturePath(settings);

    return new Promise(function (resolve, reject) {
        var tmpPromise = this;

        fs.stat(globPath.dir, function (err) {

            if (err) {
                return reject('Fixtures path "' + globPath.dir + '" dosn`t exists');
            }

            Finder.from(globPath.dir).findFiles(globPath.pattern, resolve.bind(tmpPromise));
        });
    });
};


WaterlineFixtures.prototype.getAllFixturesContent = function (settings) {

    var me = this;
    return me.getAllFixtures(settings).then(function (fileList) {
        var allGetFilesPromises = [];
        fileList.forEach(function (pathToFile) {
            allGetFilesPromises.push(

                promisedReadFile(pathToFile)
                .then(function (content) {
                    return {
                        'status': true,
                        'content': content,
                        'path': pathToFile,
                        'ext': path.extname(pathToFile).replace('.', '')
                    };
                })
            );
        });

        return Promise.all(allGetFilesPromises);
    });
};


WaterlineFixtures.prototype.getFixtures = function (settings) {

    var me = this;

    return me.getAllFixturesContent(settings).then(function (rawFixtureList) {
        return rawFixtureList;
    });
};



var watcher;

WaterlineFixtures.prototype.observe = function (settings) {

    var commandList = ['start', 'stop', 'restart'];

    var command = 'restart'; //Default on change settings

    if (_.isString(arguments[0])) {
        command = arguments[0];
    }

    if (commandList.indexOf(command) < 0) {
        console.error('Unknown command ' + command);
        return false;
    }


    var chokidarSettings = {
        ignored: /[\/\\]\./,
        persistent: true
    };

    watcher = chokidar.watch(settings.dir, chokidarSettings);
    switch (command) {

    case 'start':
        break;
    case 'stop':

        if (!watcher) {
            console.error('Fixture observer is not yet started');
            return false;
        }

        watcher.close();
        break;

    case 'restart':




        break;
    }


    return watcher;
};



//WaterlineFixtures.prototype.allFixturesData = {};



WaterlineFixtures.prototype.loadFixturesToWaterline = function (modelName, data, timeout) {

    if (_.isArray(arguments[0])) {
        var allPromises = [];
        var fixtureDataList = arguments[0];

        fixtureDataList.forEach(function (fixtureData) {
            allPromises.push(WaterlineFixtures.loadFixtureToWaterline(fixtureData).catch(function (err) {
                console.log(err.stack);
                console.error(err);
            }));
        });

        return Promise.all(allPromises);
    }

    if (_.isObject(arguments[0])) {

        var fixtureObject = arguments[0];
        return WaterlineFixtures.loadFixtureToWaterline(fixtureObject.model, fixtureObject.items, fixtureObject.timeout);
    }

    return new Promise(function (resolve, reject) {
        if (!modelName || !data) {
            return reject('Wrong fixture file');
        }

        if (timeout) {

        }

        //Need reload all data in model ?

        resolve([modelName, data]);
    });
};


//TODO Reload timers(?)
//TODO Infinite timers
//TODO Rando9m data range timer




module.exports = function () {
    return new WaterlineFixtures.apply(WaterlineFixtures, arguments);
};