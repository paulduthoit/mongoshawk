/**
 * Validation constructor
 */
function Validation() {}



/**
 * Regex validation
 *
 * @params {String}   value
 * @params {Regex}    regex
 * @params {Function} callback
 *
 * @api private
 */
Validation.regex = function(value, regex, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");
    if(!(regex instanceof RegExp))
        throw new Error("regex have to be a regex");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(regex)) {
        callback({
            "error" : {
                "message"   : "Must match with the following regex : " + regex.toString(),
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Email validation
 *
 * @params {String}   value
 * @params {Function} callback
 *
 * @api private
 */
Validation.email = function(value, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(/^[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,8}$/)) {
        callback({
            "error" : {
                "message"   : "Must be a valid email address",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Alpha validation
 *
 * @params {String}   value
 * @params {Function} callback
 *
 * @api private
 */
Validation.alpha = function(value, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(/^[a-zA-Z]*$/)) {
        callback({
            "error" : {
                "message"   : "Must contain only letters",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Alpha or numeric validation
 *
 * @params {String}   value
 * @params {Function} callback
 *
 * @api private
 */
Validation.alphaNumeric = function(value, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(/^[0-9a-zA-Z]*$/)) {
        callback({
            "error" : {
                "message"   : "Must contain only letters and numbers",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Alpha, numeric, dash or underscore validation
 *
 * @params {String}   value
 * @params {Function} callback
 *
 * @api private
 */
Validation.alphaNumericDashUnderscore = function(value, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(/^[0-9a-zA-Z_-]*$/)) {
        callback({
            "error" : {
                "message"   : "Must contain only letters, numbers, dash and underscore",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Length validation
 *
 * @params {String}   value
 * @params {Number}   min
 * @params {Number}   [max]
 * @params {Function} callback
 *
 * @api private
 */
Validation.length = function(value, min, max, callback) {

    // Check arguments
    if(arguments.length === 3) {
        callback = max;
        max = false;
    }

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");
    if(typeof(min) !== "number")
        throw new Error("min have to be a number");
    if(typeof(max) !== "number" && max !== false)
        throw new Error("max have to be a number");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(max !== false && (value.length < min || value.length > max)) {
        callback({
            "error" : {
                "message"   : "Must contain between " + min + " and " + max + " character(s)",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(value.length < min) {
        callback({
            "error" : {
                "message"   : "Must contain minimum " + max + " character(s)",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(max !== false && value.length > max) {
        callback({
            "error" : {
                "message"   : "Must contain maximum " + max + " character(s)",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * InList validation
 *
 * @params {String}   value
 * @params {Array}    list
 * @params {Function} callback
 *
 * @api private
 */
Validation.inList = function(value, list, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string" && typeof(value) !== "number")
        throw new Error("value have to be a string or a number");
    if(!(list instanceof Array))
        throw new Error("list have to be an array");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(list.indexOf(value) === -1) {
        var popped = list.pop();
        callback({
            "error" : {
                "message"   : "Must be " + list.join(", ") + " or " + popped,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Ip validation
 *
 * @params {String}   value
 * @params {String}   [type] (ipv4|ipv6|both)
 * @params {Function} callback
 *
 * @api private
 */
Validation.ip = function(value, type, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");
    if(typeof(type) !== "undefined" && typeof(type) !== "string")
        throw new Error("type have to be a string");
    if(typeof(type) === "undefined")
        var type = "both";

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(type === "ipv4" && !value.match(/^([0-9]{1,3}\.){3}([0-9]{1,3})$/)) {
        callback({
            "error" : {
                "message"   : "Must be a valid ipv4 address",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(type === "ipv6" && !value.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/)) {
        callback({
            "error" : {
                "message"   : "Must be a valid ipv6 address",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(type === "both" && !value.match(/^([0-9]{1,3}\.){3}([0-9]{1,3})$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/)) {
        callback({
            "error" : {
                "message"   : "Must be a valid ipv4 or ipv6 address",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Url validation
 *
 * @params {String}   value
 * @params {Function} callback
 *
 * @api private
 */
Validation.url = function(value, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "string")
        throw new Error("value have to be a string");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if match
    if(!value.match(/^((http:\/\/|https:\/\/)(www.)?(([a-zA-Z0-9-]){1,}\.){1,4}([a-zA-Z]){2,6}(\/([a-zA-Z-_\/\.0-9#:?=&;,\(\)%]*)?)?)$/)) {
        callback({
            "error" : {
                "message"   : "Must be a valid url",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}



/**
 * Comparison validation
 *
 * @params {Number}   value
 * @params {String}   operator
 * @params {Number}   check
 * @params {Function} callback
 *
 * @api private
 */
Validation.comparison = function(value, operator, check, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "number")
        throw new Error("value have to be a number");
    if(typeof(operator) !== "string" && !operator.match(/(=|!=|<=|<|>=|>)$/))
        throw new Error("operator have to be defined as a valid operator");
    if(typeof(check) !== "number")
        throw new Error("check have to be a number");

    // Check if undefined
    if(typeof(value) === "undefined" || isNaN(value)) {
        callback(null);
        return;
    }

    // Check if match
    if(operator === "=" && value != check) {
        callback({
            "error" : {
                "message"   : "Must be equal to " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(operator === "!=" && value == check) {
        callback({
            "error" : {
                "message"   : "Must be different from " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(operator === "<=" && value > check) {
        callback({
            "error" : {
                "message"   : "Must be lower or equal to " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(operator === "<" && value >= check) {
        callback({
            "error" : {
                "message"   : "Must be lower than " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(operator === ">=" && value < check) {
        callback({
            "error" : {
                "message"   : "Must be upper or equal to " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(operator === ">" && value <= check) {
        callback({
            "error" : {
                "message"   : "Must be upper than " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Range validation
 *
 * @params {Number}   value
 * @params {Number}   min
 * @params {Number}   max
 * @params {Function} callback
 *
 * @api private
 */
Validation.range = function(value, min, max, callback) {

    // Check datas
    if(typeof(value) !== "undefined" && typeof(value) !== "number")
        throw new Error("value have to be a number");
    if(typeof(min) !== "number")
        throw new Error("min have to be a number");
    if(typeof(max) !== "number")
        throw new Error("max have to be a number");

    // Check if undefined
    if(typeof(value) === "undefined" || isNaN(value)) {
        callback(null);
        return;
    }

    // Check if match
    if(value < min) {
        callback({
            "error" : {
                "message"   : "Must be upper or equal to " + min,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(value > max) {
        callback({
            "error" : {
                "message"   : "Must be lower or equal to " + max,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}



/**
 * Equal validation
 *
 * @params {Mixed}    value
 * @params {Mixed} 	  check
 * @params {Function} callback
 *
 * @api private
 */
Validation.equalTo = function(value, check, callback) {

    // Check datas
    if(typeof(check) === "undefined")
        throw new Error("check have to be defined");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if equal to check
    if(value != check) {
        callback({
            "error" : {
                "message"   : "Must be equal to the following element : " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}

/**
 * Strict equal validation
 *
 * @params {Mixed} 	  value
 * @params {Mixed} 	  check
 * @params {Function} callback
 *
 * @api private
 */
Validation.strictEqualTo = function(value, check, callback) {

    // Check datas
    if(typeof(check) === "undefined")
        throw new Error("check have to be defined");

    // Check if undefined
    if(typeof(value) === "undefined" || value === "") {
        callback(null);
        return;
    }

    // Check if equal to check
    if(value !== check) {
        callback({
            "error" : {
                "message"   : "Must be strictly equal to the following element : " + check,
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}



/**
 * NotEmpty validation
 *
 * @params {Mixed}    value
 * @params {Function} callback
 *
 * @api private
 */
Validation.notEmpty = function(value, callback) {

    if(value === null) {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(typeof(value) === "string" && value === "") {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(typeof(value) === "number" && isNaN(value)) {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(value instanceof Date && isNaN(Number(value))) {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(value instanceof Array && value.length === 0) {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    } else if(value instanceof Object && Object.keys(value).length === 0) {
        callback({
            "error" : {
                "message"   : "Must be non empty",
                "type"      : "ValidationException",
                "code"      : "?"
            }
        });
        return;
    }

    callback(null);
    return;

}


/**
 * Module exports
 */
module.exports = Validation;