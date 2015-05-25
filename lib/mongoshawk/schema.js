/**
 * Schema constructor
 *
 * @params {Object} [fields]
 * @params {Object} [options]
 *
 * @api public
 */
function Schema(fields, options) {

    // Check method arguments
    if(arguments.length === 1) {
        var options = {};
    } else if(arguments.length === 0) {
        var fields  = {};
        var options = {};
    }

    // Check datas
    if(typeof(fields) !== "object")
        throw "fields have to be an object";
    if(typeof(options) !== "object")
        throw "options have to be an object";

    // Datas
    var SchemaField = require('./schemafield.js');
    var allowUndefinedFields = true;

    // Check if allow undefined fields
    if(typeof(options.allowUndefinedFields) !== "undefined" && !options.allowUndefinedFields)
        allowUndefinedFields = false;

    // Walk through fields
    Object.keys(fields).forEach(function(fieldName) {

        // Field datas
        var fieldType;
        var fieldOptions;

        // Get field type and field options
        if(fields[fieldName] instanceof Array && typeof(fields[fieldName][0]) === "object" && typeof(fields[fieldName][0].type) !== "undefined") {
            fieldType = fields[fieldName][0].type;
            delete fields[fieldName][0].type;
            fieldOptions = fields[fieldName][0];
        } else if(typeof(fields[fieldName]) === "object" && typeof(fields[fieldName].type) !== "undefined") {
            fieldType = fields[fieldName].type;
            delete fields[fieldName].type;
            fieldOptions = fields[fieldName];
        } else {
            fieldType = fields[fieldName];
            fieldOptions = {};
        }

        // Get field instance
        fields[fieldName] = new SchemaField(fieldName, fieldType, fieldOptions);

    });

    // Set instance datas
    this.fields = fields;
    this.allowUndefinedFields = allowUndefinedFields;

}



/**
 * Schema datas
 */
Schema.prototype.fields;
Schema.prototype.allowUndefinedFields;



/**
 * Schema constants
 */
Schema.Types = {
    String      : require('./types/string.js'),
    Int         : require('./types/int.js'),
    Float       : require('./types/float.js'),
    Number      : require('./types/number.js'),
    Date        : require('./types/date.js'),
    Boolean     : require('./types/boolean.js'),
    Array       : require('./types/array.js'),
    Object      : require('./types/object.js'),
    Mixed       : require('./types/mixed.js'),
    ObjectId    : require('./types/objectid.js')
};



/**
 * Add field
 *
 * @params {String} fieldPath
 * @params {Mixed}  details
 *
 * @api public
 */
Schema.prototype.addField = function(fieldPath, details) {

    // Check datas
    if(typeof(fieldPath) !== "string")
        throw "fieldPath have to be a string";
    if(typeof(details) === "undefined")
        throw "details have to be defined";

    // Datas
    var SchemaField = require('./schemafield.js');
    var type;
    var options;

    // Get type and options
    if(typeof(details) === "object" && typeof(details.type) !== "undefined") {
        type = details.type;
        delete details.type;
        options = details;
    } else {
        type = details;
        options = {};
    }

    // Set field
    this.fields[fieldPath] = new SchemaField(fieldPath, type, options);

};

/**
 * Get fields
 *
 * @return {Object} fields
 * @api public
 */
Schema.prototype.getFields = function() {
    return this.fields;
};

/**
 * Get a field
 *
 * @params {String} fieldPath
 *
 * @return {Object} fields
 * @api public
 */
Schema.prototype.getField = function(fieldPath) {

    // Check datas
    if(typeof(fieldPath) !== "string")
        throw "fieldPath have to be a string";

    // Return field
    return this.fields[fieldPath];

};

/**
 * Delete a field
 *
 * @params {String} fieldPath
 *
 * @return {Object} fields
 * @api public
 */
Schema.prototype.deleteField = function(fieldPath) {

    // Check datas
    if(typeof(fieldPath) !== "string")
        throw "fieldPath have to be a string";

    // Delete field
    delete this.fields[fieldPath];

};



/**
 * Formate datas
 *
 * @params {Object} datas
 * @params {String} action (create|update)
 *
 * @return {Object} datas
 * @api public
 */
Schema.prototype.formate = function(datas, action) {

    // Check datas
    if(typeof(datas) !== "object")
        throw "datas have to be an object";
    if(typeof(action) !== "string" || ["create", "update"].indexOf(action) === -1)
        throw "action have to be a string defined as create or update";

    // Datas
    var self                    = this;
    var fields                  = this.fields;

    // Walk through instance fields
    Object.keys(fields).forEach(function(fieldName) {

        // Validate field datas
        var formatedFieldDatas = fields[fieldName].formate(datas[fieldName], action);

        // Set formated field datas
        if(typeof(formatedFieldDatas) !== "undefined")
            datas[fieldName] = formatedFieldDatas;

    });

    // Return datas
    return datas;

}



/**
 * Validate schema
 *
 * @params {Object}   datas
 * @params {String}   action (create|update)
 * @params {Function} callback
 *
 * @api public
 */
Schema.prototype.validate = function(datas, action, callback) {

    // Check datas
    if(typeof(datas) !== "object")
        throw "datas have to be an object";
    if(typeof(action) !== "string" || ["create", "update"].indexOf(action) === -1)
        throw "action have to be a string defined as create or update";

    // Datas
    var self                    = this;
    var fields                  = this.fields;
    var allowUndefinedFields    = this.allowUndefinedFields;
    var errors                  = [];

    // Walk through instance fields
    Object.keys(fields).forEach(function(fieldName) {

        // Validate field datas
        fields[fieldName].validate(datas[fieldName], action, function(validationErrors) {

            // Push to errors
            if(validationErrors) {
                errors = errors.concat(validationErrors.error.datas);
            }

        });

    });

    // If undefined fields is not allowed
    if(!allowUndefinedFields) {

        // Walk through object
        Object.keys(datas).forEach(function(datafieldName) {

            // Datas
            var allowed = false;

            // Check if the field exists
            Object.keys(fields).forEach(function(fieldName) {
                if(fieldName === datafieldName) allowed = true;
            });

            // If not allowed
            if(!allowed) errors.push({ "field" : datafieldName, "message" : "The " + datafieldName + " field is not an allowed field" });

        });

    }

    if(errors.length) {
        callback({
            "error" : {
                "message"   : "Invalid datas",
                "type" 		: "ValidationException",
                "datas" 	: errors,
                "code"      : "?"
            }
        });
        return;
    }

    // Validation is ok
    callback(null);
    return;

}


/**
 * Module exports
 */
module.exports = Schema;