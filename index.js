'use strict';

var fs = require('fs');

/**
 * @class Skimap
 * @param options Options of the new Skimap object
 *                options might be :
 *                filePath : Path to the map file
 */
function Skimap(options) {

	this.map;
	this.mapWidth;
	this.mapHeight;

	if(options && options.filePath) {
		this.traceMap(options.filePath);
	}

	return this;

};

Skimap.prototype.traceMap = function (filePath) {
	var self = this;

	var mapText = fs.readFileSync(filePath, { encoding: 'utf8' });

	var mapArray = [];
	var mapInfoArray = mapText.split('\n');

	var extractHeader = function(headerString) {
		var headerArray = headerString.trim().split(' ');
		self.mapWidth = parseInt(headerArray[0]);
		self.mapHeight = parseInt(headerArray[1]);
	}
	var extractRow = function(rowString) {
		var itemArray = rowString.trim().split(' ');
		for(var i = 0; i < itemArray.length; i++) {
			var newItem = {
				elevation: parseInt(itemArray[i])
			};
			mapArray.push(newItem);
		}
	}

	extractHeader(mapInfoArray[0]);
	for (var i = 1; i < mapInfoArray.length; i++) {
		extractRow(mapInfoArray[i]);
	}

	this.map = mapArray;
};

if(module) {
	module.exports = Skimap;
}
