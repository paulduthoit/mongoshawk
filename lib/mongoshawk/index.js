var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;


/**
 * Mongoshawk constructor
 */
var Mongoshawk = function() {

};


/**
 * Mongoshawk datas
 */
Mongoshawk.connections = {};
Mongoshawk.models = {};



/**
 * Mongoshawk constants
 */
Mongoshawk.Model = require('./model.js');
Mongoshawk.Schema = require('./schema.js');
Mongoshawk.SchemaField = require('./schemafield.js');
Mongoshawk.SchemaPath = require('./schemapath.js');
Mongoshawk.ValidationSet = require('./validationset.js');
Mongoshawk.ValidationRule = require('./validationrule.js');
Mongoshawk.Validation = require('./validation.js');
Mongoshawk.Url = require('./url.js');


/**
 * Create connection
 *
 * @params {String}       connectionName
 * @params {String}       databaseName
 * @params {Object|Array} serverConfig
 * @params {Object}       [options]
 * @params {Function}     [callback]
 *
 * @return {Db} connection
 * @api public
 */
Mongoshawk.createConnection = function(connectionName, databaseName, serverConfig, options, callback) {

	// Check method arguments
	if(arguments.length === 4) {
		callback = options;
		options = {};
	} else if(arguments.length === 3) {
		options = {};
	}

	// Check datas
	if(typeof(connectionName) !== "string")
		throw new Error("connectionName have to be a string");
	if(typeof(databaseName) !== "string")
		throw new Error("databaseName have to be a string");
	if(typeof(serverConfig) !== "object" && !(serverConfig instanceof Array))
		throw new Error("serverConfig have to be an object or an array");
	if(typeof(options) !== "object")
		throw new Error("options have to be an object");

	// Datas
	var mongoUrl = "mongodb://";

	// If replication set of servers
	if(serverConfig instanceof Array) {

		serverConfig.forEach(function(serverItem) {

			// Check server item values
			if(typeof(serverItem.host) !== "string")
				throw new Error("serverConfig items have to define host as a string");

			// Add server host to mongoUrl
			mongoUrl += serverItem.host;

			// Add server port to mongoUrl
			if(typeof(serverItem.port) === "string") {
				mongoUrl += ":" + serverItem.port + ",";
			}
			
			// Add "," to mongoUrl
			mongoUrl += ",";

		});

		// Remove "," from the end of mongoUrl
		mongoUrl = mongoUrl.slice(0, mongoUrl.length-1);

	} else {

		// Check server item values
		if(typeof(serverConfig.host) !== "string")
			throw new Error("serverConfig items have to define host as a string");

		// Add server host to mongoUrl
		mongoUrl += serverConfig.host;

		// Add server port to mongoUrl
		if(typeof(serverConfig.port) === "string") {
			mongoUrl += ":" + serverConfig.port;
		}

	}

	// Set database name to mongoUrl
	mongoUrl += "/" + databaseName;

	// Id options
	if(Object.keys(options).length > 0) {

		// Add option to mongoUrl
		mongoUrl += "?";

		Object.keys(options).forEach(function(optionItemKey) {

			// Add option to mongoUrl
			mongoUrl += optionItemKey + "=" + options[optionItemKey] + "&";

		});

		// Remove "&" from the end of mongoUrl
		mongoUrl = mongoUrl.slice(0, mongoUrl.length-1);

	}

	// Connection to server
	MongoClient.connect(mongoUrl, function(err, connection) {

		// If error
		if(typeof(callback) !== "undefined" && err) {
			callback(err, null); // MongoDBException
			return;
		}

		// Datas
		var databaseObject = {
			url: mongoUrl,
			connection: connection
		};

		// Save database object to mongoshawk datas
		Mongoshawk.connections[connectionName] = databaseObject;

		// Return
		if(typeof(callback) !== "undefined") {
			callback(null, connection);
			return;
		}

	});

}

/**
 * Get connections
 *
 * @return {Object} connections
 * @api public
 */
Mongoshawk.getConnections = function() {
	return Mongoshawk.connections;
};

/**
 * Get connection
 *
 * @params {String} connectionName
 *
 * @return {Db} connection
 * @api public
 */
Mongoshawk.getConnection = function(connectionName) {

	// Check datas
	if(typeof(connectionName) !== "string")
		throw new Error("connectionName have to be a string");
	
	// Check if exists
	if(typeof(Mongoshawk.connections[connectionName]) === "undefined")
		throw new Error("connectionName is not a defined connection");

	// Return connection
	return Mongoshawk.connections[connectionName];

};

/**
 * Remove connection
 *
 * @params {String} connectionName
 *
 * @api public
 */
Mongoshawk.removeConnection = function(connectionName) {

	// Check datas
	if(typeof(connectionName) !== "string")
		throw new Error("connectionName have to be a string");
	
	// Check if exists
	if(typeof(Mongoshawk.connections[connectionName]) === "undefined")
		throw new Error("connectionName is not a defined connection");

	// Remove connection
	delete Mongoshawk.connections[connectionName];

};



/**
 * Set model
 *
 * @params {String}   modelName
 * @params {Model|Db} model|dbConnection
 * @params {String}   collectionName
 * @params {Schema}   schema
 *
 * @api public
 */
Mongoshawk.addModel = function(modelName, dbConnection, collectionName, schema) {

	// Check method arguments
	if(arguments.length === 2) {

		// Datas
		var model = dbConnection;

		// Check datas
		if(typeof(modelName) !== "string")
			throw new Error("modelName have to be a string");
		if(!(model instanceof Mongoshawk.Model))
			throw new Error("model have to be a Mongoshawk.Model object");

		// Set model
		Mongoshawk.models[modelName] = model;

		// Return model
		return model;

	} else {

		// Get connection
		if(typeof(dbConnection) === "string") {
			dbConnection = Mongoshawk.getConnection(dbConnection);
		}

		// Check datas
		if(typeof(modelName) !== "string")
			throw new Error("modelName have to be a string");
		if(!(dbConnection instanceof Db))
			throw new Error("dbConnection have to be a Db object");
		if(typeof(collectionName) !== "string")
			throw new Error("collectionName have to be a string");
		if(!(schema instanceof Mongoshawk.Schema))
			throw new Error("schema have to be a Schema object");

		// Model constructor
		var newModel = function() {

		    // Call parent constructor
		    Mongoshawk.Model.apply(this, arguments);

		    // Change static self
		    this.staticSelf = newModel;

		}

		// Inherit Mongoshawk.Model
		newModel = _.extend(newModel, Mongoshawk.Model);
		newModel.prototype = Object.create(Mongoshawk.Model.prototype);
	
		// Init model
		newModel.init(dbConnection, collectionName, schema);

		// Set model
		Mongoshawk.models[modelName] = newModel;

		// Return model
		return newModel;

	}

}

/**
 * Get models
 *
 * @return {Array} models
 * @api public
 */
Mongoshawk.getModels = function() {
	return Mongoshawk.models;
};

/**
 * Get a model
 *
 * @params {String} modelName
 *
 * @return {Model} model
 * @api public
 */
Mongoshawk.getModel = function(modelName) {

	// Check datas
	if(typeof(modelName) !== "string")
		throw new Error("modelName have to be a string");
	
	// Check if exists
	if(typeof(Mongoshawk.models[modelName]) === "undefined")
		throw new Error("modelName is not a defined model");

	// Return model
	return Mongoshawk.models[modelName];

}

/**
 * Remove a model
 *
 * @params {String} modelName
 *
 * @api public
 */
Mongoshawk.removeModel = function(modelName) {

	// Check datas
	if(typeof(modelName) !== "string")
		throw new Error("modelName have to be a string");
	
	// Check if exists
	if(typeof(Mongoshawk.models[modelName]) === "undefined")
		throw new Error("modelName is not a defined model");

	// Remove model
	delete Mongoshawk.models[modelName];

};


/**
 * Module exports
 */
module.exports = Mongoshawk;