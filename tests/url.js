var assert = require("assert");
var logInfo = require("debug")("info");
var _ = require("underscore");
var fs = require("fs");
var Mongoshawk = require("../lib/mongoshawk");
var config = require("./config");


// url.js
describe('url.js :', function() {

	// Parse query
	describe('Mongoshawk.Url.parseQuery', function() {
		
		it('should match an empty string', function() {

			// Data
			var query = "";
			var parsedQuery = Mongoshawk.Url.parseQuery(query);

			// Log
			logInfo(parsedQuery);

			// Test
			assert.equal(typeof parsedQuery, 'object');
			assert.equal(JSON.stringify(parsedQuery), JSON.stringify({}));

			// Resolve
			return Promise.resolve();

		});
		
		it('should match an alone argument', function() {

			// Data
			var query = "argument";
			var parsedQuery = Mongoshawk.Url.parseQuery(query);

			// Log
			logInfo(parsedQuery);

			// Test
			assert.equal(typeof parsedQuery, 'object');
			assert.equal(JSON.stringify(parsedQuery), JSON.stringify({
				argument: {}
			}));

			// Resolve
			return Promise.resolve();

		});
		
		it('should match greater than a number', function() {

			// Data
			var query = "argument.gt(2)";
			var parsedQuery = Mongoshawk.Url.parseQuery(query);

			// Log
			logInfo(parsedQuery);

			// Test
			assert.equal(typeof parsedQuery, 'object');
			assert.equal(JSON.stringify(parsedQuery), JSON.stringify({
				argument: { "$gt": 2 } 
			}));

			// Resolve
			return Promise.resolve();

		});
		
		it('should match lower than a number', function() {

			// Data
			var query = "argument.lt(2.2)";
			var parsedQuery = Mongoshawk.Url.parseQuery(query);

			// Log
			logInfo(parsedQuery);

			// Test
			assert.equal(typeof parsedQuery, 'object');
			assert.equal(JSON.stringify(parsedQuery), JSON.stringify({
				argument: { "$lt": 2.2 }
			}));

			// Resolve
			return Promise.resolve();

		});
		
		it('should complexe string', function() {

			// Data
			var query = "and(argument.lt(3),argument.gt(1),or(argument2.lt(12),argument2.gt(6)))";
			var parsedQuery = Mongoshawk.Url.parseQuery(query);

			// Log
			logInfo(parsedQuery);

			// Test
			assert.equal(typeof parsedQuery, 'object');
			assert.equal(JSON.stringify(parsedQuery), JSON.stringify({
				"$and": [
					{ argument: { "$lt": 3 } },
					{ argument: { "$gt": 1 } },
					{ "$or": [
						{ argument2: { "$lt": 12 } },
						{ argument2: { "$gt": 6 } }
					] }
				]
			}));

			// Resolve
			return Promise.resolve();

		});

	});

});