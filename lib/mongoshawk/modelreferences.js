var _ 		= require("underscore");

/**
 * Model references
 */
var ModelReferences = {};


/**
 * Populate references
 *
 * @params {Object}   requestedReferences
 * @params {Array}    datas
 * @params {Function} callback
 *
 * @api private
 */
ModelReferences.populateReferences = function(self, references, requestedReferences, datas, callback) {

	// Looped required
	var Model = require('./model.js');

	// Check datas
	if(!(self instanceof Model))
		throw "self have to be a model";
	if(typeof(requestedReferences) !== "object")
		throw "requestedReferences have to be an object";
	if(!(datas instanceof Array))
		throw "datas have to be an array";
	if(typeof(callback) !== "function")
		throw "callback have to be a function";

	// Hash references from datas
	hashedReferences = ModelReferences.hashReferencesFromDatas(requestedReferences, datas);

	// Listing datas
	var listingExecuted   = 0;
	var listingCount      = Object.keys(hashedReferences).length;

	// Walk through hash references
	Object.keys(hashedReferences).forEach(function(fieldKey) {

		// Datas
		var fieldReference = references[fieldKey];

		// If many references
		if(fieldReference instanceof Array) {

			// Datas
			var asyncFunctions = [];

			// Walk through field references
			fieldReference.forEach(function(fieldReferenceItem) {

				asyncFunctions.push(function(asyncCallback) {

					// Datas
					var fieldHash    	= hashedReferences[fieldKey];
					var fieldFilter  	= {};
					var fieldFields  	= {};
					var fieldOptions 	= {};
					var listAction  	= false;
					var listActionSelf  = false;

					// Get fields
					if(typeof(requestedReferences[fieldKey]) === "object" && typeof(requestedReferences[fieldKey]["$fields"]) === "object") {
						fieldFields = requestedReferences[fieldKey]["$fields"];
					} else if(typeof(requestedReferences[fieldKey]) === "object") {
						fieldFields = requestedReferences[fieldKey];
					}

					// Get filter
					fieldFilter._id = {"$in" : fieldHash};

					// Get list action
					if(fieldReferenceItem.prototype instanceof Model) {
						var fieldModelInstance = new fieldReferenceItem();
						listAction = fieldModelInstance.list;
						listActionSelf = fieldModelInstance;
					} else {
						listAction = fieldReferenceItem;
						listActionSelf = self;
					}

					// Get field hashed references
					listAction.call(listActionSelf, fieldFilter, fieldFields, fieldOptions, function(err, fieldDatas) {

						// If error
						if(err) {
							asyncCallback(err);
							return;
						}

						// Check field datas
						if(typeof(fieldDatas) !== "object" || typeof(fieldDatas.datas) === "undefined") {
							throw "Returned datas is invalid";
						}

						// Replace hash references
						hashedReferences[fieldKey] = fieldDatas.datas;

						// Continue
						asyncCallback(null);
						return;

					});

				});

			});

			// Async tasks
			async.parallel(asyncFunctions, function(err) {

				// If error
				if(err) {
					callback(err, null);
					return;
				}

				// Increment executed listing
				listingExecuted++;

				// If finished
				if(listingExecuted === listingCount) {

					// Hashed references to datas
					datas = ModelReferences.hashedReferencesToDatas(hashedReferences, datas);

					// Callback
					callback(err, datas);
					return;

				}

			});

		}

		// If unique reference
		else {

			var fieldHash    	= hashedReferences[fieldKey];
			var fieldFilter  	= {};
			var fieldFields  	= {};
			var fieldOptions 	= {};
			var listAction  	= false;
			var listActionSelf  = false;

			// Get fields
			if(typeof(requestedReferences[fieldKey]) === "object" && typeof(requestedReferences[fieldKey]["$fields"]) === "object") {
				fieldFields = requestedReferences[fieldKey]["$fields"];
			} else if(typeof(requestedReferences[fieldKey]) === "object") {
				fieldFields = requestedReferences[fieldKey];
			}

			// Get filter
			fieldFilter._id = {"$in" : fieldHash};

			// Get list action
			if(fieldReference.prototype instanceof Model) {
				var fieldModelInstance = new fieldReference();
				listAction = fieldModelInstance.list;
				listActionSelf = fieldModelInstance;
			} else {
				listAction = fieldReference;
				listActionSelf = self;
			}

			// Get field hashed references
			listAction.call(listActionSelf, fieldFilter, fieldFields, fieldOptions, function(err, fieldDatas) {

				// If error
				if(err) {
					callback(err, null);
					return;
				}

				// Check field datas
				if(typeof(fieldDatas) !== "object" || typeof(fieldDatas.datas) === "undefined") {
					throw "Returned datas is invalid";
				}

				// Replace hash references
				hashedReferences[fieldKey] = fieldDatas.datas;

				// Increment executed listing
				listingExecuted++;

				// If finished
				if(listingExecuted === listingCount) {

					// Hashed references to datas
					datas = ModelReferences.hashedReferencesToDatas(hashedReferences, datas);

					// Callback
					callback(err, datas);
					return;

				}

			});

		}

	});


}

/**
 * Hash references from datas
 *
 * @params {Object} references
 * @params {Array}  datas
 *
 * @return {Object} hashedReferences
 * @api private
 */
ModelReferences.hashReferencesFromDatas = function(references, datas) {

	// Check datas
	if(typeof(references) !== "object")
		throw "references have to be an object";
	if(!(datas instanceof Array))
		throw "datas have to be an array";

	// Datas
	var hashedReferences = {};

	// Walk through datas
	datas.forEach(function(dataItem) {

		// Walk through references
		Object.keys(references).forEach(function(fieldKey) {

			// Create field hash
			if(typeof(hashedReferences[fieldKey]) === "undefined")
				hashedReferences[fieldKey] = [];

			// Get hash values
			var hashedResults = ModelReferences.hashReferencesFromDatasByField(fieldKey, dataItem);
			hashedReferences[fieldKey] = hashedReferences[fieldKey].concat(hashedResults);

		});

	});

	return hashedReferences;

}

/**
 * Hash references by field
 *
 * @params {String} field
 * @params {Object} datas
 *
 * @return {Array} hashedReferences
 * @api private
 */
ModelReferences.hashReferencesFromDatasByField = function(field, datas) {

	// Check datas
	if(typeof(field) !== "string")
		throw "field have to be a string";
	if(typeof(datas) !== "object")
		throw "datas have to be an object";

	// Datas
	var hashedReferences 	= [];
	var splitedField        = field.split('.');
	var fieldPathRoot       = splitedField[0];

	// If last child
	if(splitedField.length === 1) {

		// Get hash values
		if(datas[fieldPathRoot] instanceof Array)
			hashedReferences = hashedReferences.concat(datas[fieldPathRoot]);
		else if(typeof(datas[fieldPathRoot]) !== "undefined")
			hashedReferences.push(datas[fieldPathRoot]);

	} 

	// If need continue
	else {
	
		// Datas
		var fieldPathChild  = splitedField.slice(1).join(".");

		// If field datas is array
		if(datas[fieldPathRoot] instanceof Array) {

			// Walk through field datas
			datas[fieldPathRoot].forEach(function(dataItem) {

				// Get hashed values
				var hashedResults = ModelReferences.hashReferencesFromDatasByField(fieldPathChild, dataItem);
				hashedReferences = hashedReferences.concat(hashedResults);

			});

		}

		else if(typeof(datas[fieldPathRoot]) !== "undefined") {
			
			// Get hashed value
			hashedReferences = ModelReferences.hashReferencesFromDatasByField(fieldPathChild, datas[fieldPathRoot]);

		}

	}

	return hashedReferences;

}

/**
 * Hashed references to datas
 *
 * @params {Object} hashedReferences
 * @params {Array}  datas
 *
 * @return {Array} datas
 * @api private
 */
ModelReferences.hashedReferencesToDatas = function(hashedReferences, datas) {

	// Check datas
	if(typeof(hashedReferences) !== "object")
		throw "hashedReferences have to be an object";
	if(!(datas instanceof Array))
		throw "datas have to be an array";

	// Walk through datas
	datas.forEach(function(dataItem, dataIndex, dataArray) {

		// Walk through hashed references
		Object.keys(hashedReferences).forEach(function(fieldKey) {

			// Array to object by _id
			var fieldHashedReferences = {};
			hashedReferences[fieldKey].forEach(function(hashedReference) {
				fieldHashedReferences[hashedReference._id] = hashedReference;
			});

			// Get hash values
			dataArray[dataIndex] = ModelReferences.hashedReferencesToDatasByField(fieldHashedReferences, fieldKey, dataArray[dataIndex]);

		});

	});

	return datas;

}

/**
 * Hashed references to datas by field
 *
 * @params {Array}  references
 * @params {String} field
 * @params {Object} datas
 *
 * @return {Object} datas
 * @api private
 */
ModelReferences.hashedReferencesToDatasByField = function(references, field, datas) {

	// Check datas
	if(typeof(references) !== "object")
		throw "references have to be an object";
	if(typeof(field) !== "string")
		throw "field have to be a string";
	if(typeof(datas) !== "object")
		throw "datas have to be an object";

	// Datas
	var splitedField 	= field.split('.');
	var fieldPathRoot 	= splitedField[0];

	// If last child
	if(splitedField.length === 1) {

		if(datas[fieldPathRoot] instanceof Array) {

			// Change reference to data
			datas[fieldPathRoot].forEach(function(dataItem, dataIndex, dataArray) {
				dataArray[dataIndex] = _.extend({}, references[dataItem]);
			});

		} else if(typeof(datas[fieldPathRoot]) !== "undefined") {

			// Change reference to data
			datas[fieldPathRoot] = _.extend({}, references[datas[fieldPathRoot]]);

		}

	} 

	// If need continue
	else {
	
		// Datas
		var fieldPathChild  = splitedField.slice(1).join(".");

		// If field datas is array
		if(datas[fieldPathRoot] instanceof Array) {

			// Walk through field datas
			datas[fieldPathRoot].forEach(function(dataItem, dataIndex, dataArray) {

				// Hashed references to data by field
				dataArray[dataIndex] = ModelReferences.hashedReferencesToDatasByField(references, fieldPathChild, dataArray[dataIndex]);

			});

		}

		else if(typeof(datas[fieldPathRoot]) !== "undefined") {

			// Hashed references to data by field
			datas[fieldPathRoot] = ModelReferences.hashedReferencesToDatasByField(references, fieldPathChild, datas[fieldPathRoot]);

		}

	}

	return datas;

}


/**
 * Module exports
 */
module.exports = ModelReferences;