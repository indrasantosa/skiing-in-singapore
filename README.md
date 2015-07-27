# Skiing in Singapore (RedMart Problem)

This is a code that I make for the Skiing in Singapore, RedMart Problem.
see the problem [here](http://geeks.redmart.com/2015/01/07/skiing-in-singapore-a-coding-diversion/)

Hope it went thru.

This code is a nodejs library code.
To use this, import it as a module :
```
var Skimap = module('skimap');

var skimap = new Skimap({
		filePath: __dirname + '/path/to/file.txt'
	});
var longestPath = skimap.getLongestPath();
// this will return the longest path object
console.log(longestPath.path);
```
