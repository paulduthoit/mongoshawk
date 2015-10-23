var ValidationRule = require('./validationrule.js');
var ValidationException = require('./exceptions/validation');


/**
 * ValidationSet constructor
 *
 * @params {Array} rules
 *
 * @api public
 */
function ValidationSet(rules) {

    // Check datas
    if(!(rules instanceof Array))
        throw new Error("rule have to be an array");

    // Datas
    var self = this;
    var ValidationRule = require('./validationrule.js');

    // Set instance datas
    self.rules  = [];

    // Walk through rules
    rules.forEach(function(ruleItem) {

        // If rule is string, regex or array
        if(typeof(ruleItem) === "string" || ruleItem instanceof RegExp || ruleItem instanceof Array) {

	        // Push rule in array
	        self.rules.push(new ValidationRule(ruleItem));

        }

        // If rule is object
        else if(ruleItem instanceof ValidationRule) {

	        // Push rule in array
            self.rules.push(ruleItem);

        }

        // If rule is object
        else if(ruleItem instanceof Object) {

        	// Datas
            var ruleName = ruleItem.rule;
            delete ruleItem.rule;
            var ruleOptions = ruleItem;

	        // Push rule in array
	        self.rules.push(new ValidationRule(ruleName, ruleOptions));

        }

    });

}



/**
 * ValidationSet datas
 */
ValidationSet.prototype.rules;



/**
 * Rules validation
 *
 * @params {Mixed}    value
 * @params {String}   action (create|update)
 * @params {Function} callback
 *
 * @api public
 */
ValidationSet.prototype.validate = function(value, action, callback) {

    // Check datas
    if(typeof(action) !== "string" || ["create", "update"].indexOf(action) === -1)
        throw new Error("action have to be a string defined as create or update");

    // Datas
    var errors = [];

    // Walk through rules
    this.rules.forEach(function(ruleItem) {

    	// Check validate
    	ruleItem.validate(value, action, function(err) {

            // If error
    		if(err) {
                errors.push(err);
            }

    	});

    });

    // Check if errors
    if(errors.length > 0) {
    	callback(new ValidationException("ValidationFailed", errors));
    	return;
    }

    // Validation is ok
    callback(null);
    return;

}


/**
 * Module exports
 */
module.exports = ValidationSet;