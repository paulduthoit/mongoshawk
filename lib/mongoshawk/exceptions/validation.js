/**
 * Validation constructor
 */
function ValidationException(message) {

    // Set instance datas
    this.name = "ValidationException";
    this.message = message || "";

}


/**
 * Inherit from error
 */
ValidationException.prototype = Error.prototype;


/**
 * Module exports
 */
module.exports = ValidationException;