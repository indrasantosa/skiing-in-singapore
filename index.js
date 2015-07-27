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

	// Temporary variable before validated
	var mapWidth = 0;
	var mapHeight = 0;
	var mapArray = [];

	// Process map extraction
	var mapInfoArray = mapText.split('\n');

	var extractHeader = function(headerString) {
		var headerArray = headerString.trim().split(' ');
		mapWidth = parseInt(headerArray[0]);
		mapHeight = parseInt(headerArray[1]);
	}
	var extractRow = function(rowString) {
		var itemArray = rowString.trim().split(' ');

		// Iterate through array to push landscape data to array
		for(var i = 0; i < itemArray.length; i++) {
			var content = parseInt(itemArray[i]);
			if(!isNaN(content)) {
				var newItem = {
					elevation: content
				};
				mapArray.push(newItem);
			}
		}
	}

	extractHeader(mapInfoArray[0]);
	for (var i = 1; i < mapInfoArray.length; i++) {
		extractRow(mapInfoArray[i]);
	}

	var wireupLandscape = function() {
		// Wireup the map
		for (var i = 1; i <= self.mapWidth; i++) {
			for (var j = 1; j <= self.mapHeight; j++) {
				var current = self.getLandscape(i, j);
				current.top = self.getLandscape(i, j-1);
				current.right = self.getLandscape(i+1, j);
				current.bottom = self.getLandscape(i, j+1);
				current.left = self.getLandscape(i-1, j);
			}
		}
	}

	// Validate the result of the extraction
	if(mapArray.length === mapWidth*mapHeight) {
		this.map = mapArray;
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		wireupLandscape();
		return true;
	} else {
		return false;
	}

};

Skimap.prototype.getLandscape = function (pointX, pointY) {
	return this.map[((pointY-1)*this.mapWidth) + (pointX-1)] || undefined;
};

if(module) {
	module.exports = Skimap;
}
