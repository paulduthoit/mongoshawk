var async = require('async');
var Validation = require('./validation.js');

/**
 * Validation rule
 *
 * @params {String|Regex|Array} rule
 * @params {Object}             [options]
 *
 * @api public
 */
function ValidationRule(rule, options) {

    // Check arguments
    if(arguments.length === 1) {
        options = {};
    }

    // Check datas
    if(typeof(rule) !== "string" && !(rule instanceof RegExp) && !(rule instanceof Array))
        throw "rule have to be a string, a regex or an array";
    if(typeof(options) !== "object")
        throw "options have to be an object";

    // Set instance datas
    this.rule = "";
    this.args = [];
    this.required = false;
    this.on = true;
    this.allowEmpty = true;
    this.message = false;

    // Get rule name and args
    if(typeof(rule) === "string" || rule instanceof RegExp) {
        this.rule = rule;
        this.args = [];
    } else if(rule instanceof Array) {
        this.rule = rule.shift();
        this.args = rule;
    }

    // Get required option
    if(typeof(options.required) !== "undefined") {
    	if(options.required === "create")
	        this.required = "create";
	    else if(options.required === "update")
	        this.required = "update";
	    else if(options.required === true)
	        this.required = true;
    }

    // Get on option
    if(typeof(options.on) !== "undefined") {
    	if(options.on === "create")
	        this.on = "create";
	    else if(options.on === "update")
	        this.on = "update";
    }

    // Get allowEmpty option
    if(typeof(options.allowEmpty) !== "undefined") {
        this.allowEmpty = options.allowEmpty ? true : false;
    }

    // Get message option
    if(typeof(options.message) === "string") {
        this.message = options.message;
    }

}



/**
 * ValidationRule datas
 */
ValidationRule.prototype.rule;
ValidationRule.prototype.args;
ValidationRule.prototype.required;
ValidationRule.prototype.on;
ValidationRule.prototype.allowEmpty;
ValidationRule.prototype.message;



/**
 * Rule validation
 *
 * @params {Mixed}    value
 * @params {String}   action (create|update)
 * @params {Function} callback
 *
 * @api public
 */
ValidationRule.prototype.validate = function(value, action, callback) {

    // Check datas
    if(typeof(action) !== "string" || ["create", "update"].indexOf(action) === -1)
        throw "action have to be a string defined as create or update";

    // Datas
    var self = this;
    var ruleArguments = [];

    // Async tasks
    async.series([

        // Check allowEmpty
        function(asyncCallback) {

            // Check allowEmpty
            if(self.allowEmpty === false) {

                // Check not empty validate
                Validation.notEmpty(value, function(err) {

                    // If error
                    if(err) {
                        asyncCallback(err);
                        return;
                    }

                    // Continue
                    asyncCallback(null);
                        
                });
                return;

            }

            // Continue
            asyncCallback(null);

        },

        // Check rule
        function(asyncCallback) {

            // Check rule
            if(self.on === true || self.on === action) {

                // If undefined function
                if(typeof(self.rule) === "string" && typeof(Validation[self.rule]) !== "function")
                    throw "Validation."+self.rule+" is not a defined function";

                // If valid function
                else if(typeof(self.rule) === "string") {

                    // Get rule args
                    ruleArguments = self.args.slice();
                    ruleArguments.unshift(value);
                    ruleArguments.push(function(err) {

                        // If error
                        if(err) {
                            asyncCallback(err);
                            return;
                        }

                        // Continue
                        asyncCallback(null);

                    });

                    // Check function validate
                    Validation[self.rule].apply(Validation, ruleArguments);
                    return;

                }

                // If regex function
                else if(self.rule instanceof RegExp) {

                    // Check regex validate
                    Validation.regex(value, self.rule, function(err) {

                        // If error
                        if(err) {
                            asyncCallback(err);
                            return;
                        }

                        // Continue
                        asyncCallback(null);

                    });
                    return;

                }

            }

            // Continue
            asyncCallback(null);

        },

    ], function(err) {

        // If error
        if(err) {
            callback(err);
            return;
        }

        // Validation is ok
        callback(null);

    });

}


/**
 * Module exports
 */
module.exports = ValidationRule;