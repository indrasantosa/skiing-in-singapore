var assert = require('assert');
var Skimap = require('../');
var should = require('should');

describe('Unit Test', function() {

	describe('Skimap', function() {

		describe('.contructor', function() {

			it('Should return instance of Skimap', function() {
				var skimap = new Skimap({
					filePath: __dirname + '/files/test.txt'
				});
				skimap.should.be.an.instanceOf(Skimap);
			});
			it('Should automatically parse the map if a filePath is provided', function() {
				var skimap = new Skimap({
					filePath: __dirname + '/files/test.txt'
				});
				skimap.mapWidth.should.be.a.Number();
				skimap.mapHeight.should.be.a.Number();
				skimap.map.should.be.an.Array().and.with.lengthOf(skimap.mapWidth*skimap.mapHeight);
			});

		});

	});

});
