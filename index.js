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
	var extractRow = function(rowString, row) {
		var itemArray = rowString.trim().split(' ');

		// Iterate through array to push landscape data to array
		for(var i = 0; i < itemArray.length; i++) {
			var content = parseInt(itemArray[i]);
			if(!isNaN(content)) {
				var newItem = {
					posX: i+1,
					posY: row,
					elevation: content
				};
				mapArray.push(newItem);
			}
		}
	}

	extractHeader(mapInfoArray[0]);
	for (var i = 1; i < mapInfoArray.length; i++) {
		extractRow(mapInfoArray[i], i);
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

Skimap.prototype.getLongestPath = function (currentLandscape) {
	var self = this;

	// if currentLandscape is defined, get longest path from current landscape
	// else, get the global longest path
	if(currentLandscape) {

		if(currentLandscape.longestStops === undefined) {

			/**
			 * path model should be
			 * {
			 * 		path: [Array of landscapes],
			 * 		stops: how many steps,
			 *   	lowestElevation: lowest point of slope
			 *   	highestElevation: highest point of slope
			 * }
			 */

			var pathIndex = [];
			var pathValue = [];

			var registerAlternatePath = function(alternateLandscape) {
				if(alternateLandscape && alternateLandscape.elevation < currentLandscape.elevation) {
					var alternateLongestPath = self.getLongestPath(alternateLandscape);

					if(pathValue[alternateLongestPath.stops] === undefined) {
						pathValue[alternateLongestPath.stops] = alternateLongestPath;
						pathIndex.push(alternateLongestPath.stops);
					} else {
						var currentPath = pathValue[alternateLongestPath.stops];
						var currentElevationDiff = currentPath.highestElevation - currentPath.lowestElevation;
						var newElevationDiff = alternateLongestPath.highestElevation - alternateLongestPath.lowestElevation;

						if(newElevationDiff > currentElevationDiff) {
							pathValue[alternateLongestPath.stops] = alternateLongestPath;
						}
					}
				}
			}

			var getLongestPath = function() {
				if(pathValue.length) {
					return pathValue[Math.max.apply(null, pathIndex)];
				} else {
					return false
				}
			}

			// Get longest stops from the 4 paths
			registerAlternatePath(currentLandscape.left);
			registerAlternatePath(currentLandscape.right);
			registerAlternatePath(currentLandscape.top);
			registerAlternatePath(currentLandscape.bottom);
			var longestPath = getLongestPath();

			// if on the lowest point of slope
			if(longestPath === false) {
				return {
					path: [currentLandscape],
					stops: 1,
					lowestElevation: currentLandscape.elevation,
					highestElevation: currentLandscape.elevation
				}
			} else {
				longestPath.path = [currentLandscape].concat(longestPath.path);
				longestPath.stops = longestPath.stops + 1;
				longestPath.highestElevation = currentLandscape.elevation;
				return longestPath;
			}

		} else {
			return currentLandscape.longestStops;
		}

	} else {
		var longestPath;

		for (var i = 1; i <= self.mapWidth; i++) {
			for (var j = 1; j <= self.mapHeight; j++) {
				var newLongestPath = self.getLongestPath(self.getLandscape(i, j));
				if(longestPath === undefined) {
					longestPath = newLongestPath;
				} else {
					var currentElevationDiff = longestPath.highestElevation - longestPath.lowestElevation;
					var newElevationDiff = newLongestPath.highestElevation - newLongestPath.lowestElevation;

					if(newElevationDiff > currentElevationDiff) {
						longestPath = newLongestPath;
					}
				}
			}
		}

		return longestPath;

	}


};



if(module) {
	module.exports = Skimap;
}
