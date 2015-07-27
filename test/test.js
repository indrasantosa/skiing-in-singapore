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

		describe('.getLandscape', function() {

			it('Should return correct landscape', function() {
				var skimap = new Skimap({
					filePath: __dirname + '/files/test.txt'
				});
				skimap.getLandscape(1, 2).should.not.be.equal(undefined);
				skimap.getLandscape(1, 2).elevation.should.be.equal(2);

				skimap.getLandscape(4, 3).should.not.be.equal(undefined);
				skimap.getLandscape(4, 3).elevation.should.be.equal(5);

				skimap.getLandscape(4, 4).should.not.be.equal(undefined);
				skimap.getLandscape(4, 4).elevation.should.be.equal(6);

				(typeof skimap.getLandscape(5, 5)).should.be.equal('undefined');
			});

		});

		describe('.traceMap', function() {

			it('Should return true if successful', function() {
				var skimap = new Skimap();
				skimap.traceMap(__dirname + '/files/test.txt')
					.should.be.equal(true);
			});
			it('Should return false if unsuccessful', function() {
				var skimap = new Skimap();
				skimap.traceMap(__dirname + '/files/test-fail.txt')
					.should.be.equal(false);
			});
			it('Should wire the landscape currectly', function() {
				var skimap = new Skimap({
					filePath: __dirname + '/files/test.txt'
				});
				skimap.getLandscape(2, 2).right.elevation.should.be.equal(9);
				skimap.getLandscape(2, 4).top.elevation.should.be.equal(3);
				skimap.getLandscape(3, 2).bottom.elevation.should.be.equal(2);
				skimap.getLandscape(2, 4).left.elevation.should.be.equal(4);
				(typeof skimap.getLandscape(2, 4).bottom).should.be.equal('undefined');
			});

		});

		describe('.getLongestPath', function() {

			it('Should get the longest path correctly', function() {
				var skimap = new Skimap({
					filePath: __dirname + '/files/test.txt'
				});
				var longestStops = skimap.getLongestPath(skimap.getLandscape(3, 2));
				longestStops.stops.should.equal(5);
				longestStops.path.forEach(function(item, index) {
					console.log(item.elevation);
				});
			});

		});

	});

});
