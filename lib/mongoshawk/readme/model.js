/* Required */

    var _               = require('underscore');
    var Db              = require('mongodb').Db;
    var Schema          = require('./schema.js');
    var ValidationRule 	= require('./validationrule.js');

/* /Required */

/* Constructor */

    function Model(dbConnection, collectionName, schema, options) {};

/* /Constructor */

/* Datas */

    Model.prototype.dbConnection;
    Model.prototype.collectionName;
    Model.prototype.schema;
    Model.prototype.type;
    Model.prototype.references;
    Model.prototype.relationships;
    Model.prototype.virtuals;
    Model.prototype.datas;
    Model.prototype.beforeMiddlewares;
    Model.prototype.afterMiddlewares;

/* /Datas */

/* Getter & Setter */

    Model.prototype.setDbConnection = function(dbConnection) {};
    Model.prototype.getDbConnection = function() {};

    Model.prototype.setCollectionName = function(collectionName) {};
    Model.prototype.getCollectionName = function() {};

    Model.prototype.setSchema = function(schema) {};
    Model.prototype.getSchema = function() {};

    Model.prototype.setType = function(type) {};
    Model.prototype.getType = function() {};

    Model.prototype.addReference = function(fieldPath, reference) {};
    Model.prototype.getReferences = function() {};
    Model.prototype.getReference = function(fieldPath) {};
    Model.prototype.deleteReference = function(fieldPath) {};

    Model.prototype.addRelationship = function(fieldPath, relationship) {};
    Model.prototype.getRelationships = function() {};
    Model.prototype.getRelationship = function(fieldPath) {};
    Model.prototype.deleteRelationship = function(fieldPath) {};

    // Model.prototype.addVirtual = function(fieldPath, virtual) {};
    // Model.prototype.getVirtuals = function() {};
    // Model.prototype.getVirtual = function(fieldPath) {};
    // Model.prototype.deleteVirtual = function(fieldPath) {};

    Model.prototype.setDatas = function(dataKey, dataValue) {};
    Model.prototype.getDatas = function(dataKey) {};

    Model.prototype.before = function(functionName, callback) {};
    Model.prototype.after = function(functionName, callback) {};

/* /Getter & Setter */

/* Main Public Functions */

    Model.prototype.count = function(filter, callback) {};
    // Model.prototype.validate = function(datas, action, callback) {};

    Model.prototype.list = function(filter, fields, options, callback) {};
    Model.prototype.show = function(id, fields, callback) {};
    Model.prototype.create = function(datas, options, callback) {};
    Model.prototype.update = function(id, datas, options, callback) {};
    Model.prototype.delete = function(id, options, callback) {};
    Model.prototype.save = function(options, callback) {};

/* /Main Public Functions */

/* Private Functions */

    Model.prototype.populateRelationships = function(requestedRelationships, datas, callback) {};
    Model.prototype.hashedRelationshipsToDatas = function(hashedRelationships, datas) {};
    Model.prototype.hashedRelationshipToDatasByField = function(relationship, field, datas, relationshipField, relationshipParent) {};

    Model.prototype.populateReferences = function(requestedReferences, datas, callback) {};
    Model.prototype.hashReferencesFromDatas = function(references, datas) {};
    Model.prototype.hashReferencesFromDatasByField = function(field, datas) {};
    Model.prototype.hashedReferencesToDatas = function(hashedReferences, datas) {};
    Model.prototype.hashedReferencesToDatasByField = function(references, field, datas) {};

    Model.prototype.parseFields = function(fields, prefix) {};

/* Private Functions */