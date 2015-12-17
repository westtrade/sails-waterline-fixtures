'use strict';

var chai = require('chai');
chai.use(require('chai-as-promised'));

var expect = require('chai').expect;
var waterlineFixtures = require('../lib');
var _ = require('lodash');

var defaultSettings = waterlineFixtures.settings;
var newSettings = _.clone(defaultSettings);

describe('Sails Fixtures', function () {


    describe('check parsers', function () {

        it('should add parser', function () {

        });

        it('should print error message on not installed parser', function () {

        });


        it('should correct parse example', function () {

        });


        it('should make error on parse example', function () {

        });

    });

    describe('settings', function () {

        it('correct load original settings', function () {

            /*
            waterlineFixtures.run(function () {
            	expect(this).has.property('settings');
            	done();
            });
            */

        });

        it('correct load changed settings', function () {
            /*
            newSettings.reloadOnChange = false;
            waterlineFixtures.setSettings({ reloadOnChange: false });
            expect(waterlineFixtures.settings).has.property('reloadOnChange', false);

            waterlineFixtures.run({ reloadOnChange: true }, function () {
            expect(waterlineFixtures.settings).has.property('reloadOnChange', true);
            	done();
            });
            */

        });
    });


    describe('fixture path', function () {

        it('initial with setting object', function () {

            var opts = {};
            opts.dir = 'test/fixtures';
            waterlineFixtures.getFixturePath(opts);
        });

        it('directory', function () {
            waterlineFixtures.getFixturePath('test/fixtures');
        });

        it('array of filepath', function () {
            waterlineFixtures.getFixturePath('test/fixtures');
        });


        it('array of dirpath', function () {
            waterlineFixtures.getFixturePath('test/fixtures');
        });

        it('array of filepath and dirs', function () {
            waterlineFixtures.getFixturePath('test/fixtures');
        });

        it('file', function () {
            waterlineFixtures.getFixturePath('test/fixtures/test.json');
        });
    });



    describe('check path finder', function () {

    });


    describe('check other', function () {

        it('should get all contents', function (done) {

            var opts = {};
            opts.dir = 'test/fixtures';
            //opts.pattern = '**.json';

            waterlineFixtures.getAllFixturesContent('test/fixtures').then(function () {
                //console.log(data);
                done();
            }).catch(done);
        });

        it('should get error', function (done) {

            var opts = {};
            opts.dir = 'test/fixtures';
            //opts.pattern = '**.json';

            waterlineFixtures.getAllFixturesContent('test/fixtures').then(function () {
                //console.log(data);
                done();
            }).catch(done);
        });


    });




});