(function (name, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
    this[name] = definition();
  }
}('validator', (validator) => {
  validator = { version: '3.16.2' };

  const email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

  const creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

  const isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/;
  const isbn13Maybe = /^(?:[0-9]{13})$/;

  const ipv4Maybe = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/;
  const ipv6 = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;

  const uuid = {
    3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i, 4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, 5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  };

  const alpha = /^[a-zA-Z]+$/;
  const alphanumeric = /^[a-zA-Z0-9]+$/;
  const numeric = /^-?[0-9]+$/;
  const int = /^(?:-?(?:0|[1-9][0-9]*))$/;
  const float = /^(?:-?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/;
  const hexadecimal = /^[0-9a-fA-F]+$/;
  const hexcolor = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  const ascii = /^[\x00-\x7F]+$/;
  const multibyte = /[^\x00-\x7F]/;
  const fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
  const halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

  const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

  const base64 = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/;

  validator.extend = function (name, fn) {
    validator[name] = function () {
      const args = Array.prototype.slice.call(arguments);
      args[0] = validator.toString(args[0]);
      return fn.apply(validator, args);
    };
  };

  // Right before exporting the validator object, pass each of the builtins
  // through extend() so that their first argument is coerced to a string
  validator.init = function () {
    for (const name in validator) {
      if (typeof validator[name] !== 'function' || name === 'toString'
        || name === 'toDate' || name === 'extend' || name === 'init') {
        continue;
      }
      validator.extend(name, validator[name]);
    }
  };

  validator.toString = function (input) {
    if (typeof input === 'object' && input !== null && input.toString) {
      input = input.toString();
    } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
      input = '';
    } else if (typeof input !== 'string') {
      input += '';
    }
    return input;
  };

  validator.toDate = function (date) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
      return date;
    }
    date = Date.parse(date);
    return !isNaN(date) ? new Date(date) : null;
  };

  validator.toFloat = function (str) {
    return parseFloat(str);
  };

  validator.toInt = function (str, radix) {
    return parseInt(str, radix || 10);
  };

  validator.toBoolean = function (str, strict) {
    if (strict) {
      return str === '1' || str === 'true';
    }
    return str !== '0' && str !== 'false' && str !== '';
  };

  validator.equals = function (str, comparison) {
    return str === validator.toString(comparison);
  };

  validator.contains = function (str, elem) {
    return str.indexOf(validator.toString(elem)) >= 0;
  };

  validator.matches = function (str, pattern, modifiers) {
    if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
      pattern = new RegExp(pattern, modifiers);
    }
    return pattern.test(str);
  };

  validator.isEmail = function (str) {
    return email.test(str);
  };

  const default_url_options = {
    protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: false, allow_underscores: false,
  };

  validator.isURL = function (str, options) {
    if (!str || str.length >= 2083) {
      return false;
    }
    options = merge(options, default_url_options);
    const separators = `-?-?${options.allow_underscores ? '_?' : ''}`;
    const url = new RegExp(`^(?!mailto:)(?:(?:${options.protocols.join('|')})://)${options.require_protocol ? '' : '?'}(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:www.)?)?(?:(?:[a-z\\u00a1-\\uffff0-9]+${separators})*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+${separators})*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))${options.require_tld ? '' : '?'})|localhost)(?::(\\d{1,5}))?(?:(?:/|\\?|#)[^\\s]*)?$`, 'i');
    const match = str.match(url);
    const port = match ? match[1] : 0;
    return !!(match && (!port || (port > 0 && port <= 65535)));
  };

  validator.isIP = function (str, version) {
    version = validator.toString(version);
    if (!version) {
      return validator.isIP(str, 4) || validator.isIP(str, 6);
    } if (version === '4') {
      if (!ipv4Maybe.test(str)) {
        return false;
      }
      const parts = str.split('.').sort((a, b) => a - b);
      return parts[3] <= 255;
    }
    return version === '6' && ipv6.test(str);
  };

  validator.isAlpha = function (str) {
    return alpha.test(str);
  };

  validator.isAlphanumeric = function (str) {
    return alphanumeric.test(str);
  };

  validator.isNumeric = function (str) {
    return numeric.test(str);
  };

  validator.isHexadecimal = function (str) {
    return hexadecimal.test(str);
  };

  validator.isHexColor = function (str) {
    return hexcolor.test(str);
  };

  validator.isLowercase = function (str) {
    return str === str.toLowerCase();
  };

  validator.isUppercase = function (str) {
    return str === str.toUpperCase();
  };

  validator.isInt = function (str) {
    return int.test(str);
  };

  validator.isFloat = function (str) {
    return str !== '' && float.test(str);
  };

  validator.isDivisibleBy = function (str, num) {
    return validator.toFloat(str) % validator.toInt(num) === 0;
  };

  validator.isNull = function (str) {
    return str.length === 0;
  };

  validator.isLength = function (str, min, max) {
    const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
    const len = str.length - surrogatePairs.length;
    return len >= min && (typeof max === 'undefined' || len <= max);
  };

  validator.isByteLength = function (str, min, max) {
    return str.length >= min && (typeof max === 'undefined' || str.length <= max);
  };

  validator.isUUID = function (str, version) {
    const pattern = uuid[version || 'all'];
    return pattern && pattern.test(str);
  };

  validator.isDate = function (str) {
    return !isNaN(Date.parse(str));
  };

  validator.isAfter = function (str, date) {
    const comparison = validator.toDate(date || new Date());
    const original = validator.toDate(str);
    return !!(original && comparison && original > comparison);
  };

  validator.isBefore = function (str, date) {
    const comparison = validator.toDate(date || new Date());
    const original = validator.toDate(str);
    return original && comparison && original < comparison;
  };

  validator.isIn = function (str, options) {
    if (!options || typeof options.indexOf !== 'function') {
      return false;
    }
    if (Object.prototype.toString.call(options) === '[object Array]') {
      const array = [];
      for (let i = 0, len = options.length; i < len; i++) {
        array[i] = validator.toString(options[i]);
      }
      options = array;
    }
    return options.indexOf(str) >= 0;
  };

  validator.isCreditCard = function (str) {
    const sanitized = str.replace(/[^0-9]+/g, '');
    if (!creditCard.test(sanitized)) {
      return false;
    }
    let sum = 0; let digit; let tmpNum; let
      shouldDouble;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      digit = sanitized.substring(i, (i + 1));
      tmpNum = parseInt(digit, 10);
      if (shouldDouble) {
        tmpNum *= 2;
        if (tmpNum >= 10) {
          sum += ((tmpNum % 10) + 1);
        } else {
          sum += tmpNum;
        }
      } else {
        sum += tmpNum;
      }
      shouldDouble = !shouldDouble;
    }
    return !!((sum % 10) === 0 ? sanitized : false);
  };

  validator.isISBN = function (str, version) {
    version = validator.toString(version);
    if (!version) {
      return validator.isISBN(str, 10) || validator.isISBN(str, 13);
    }
    const sanitized = str.replace(/[\s-]+/g, '');
    let checksum = 0; let
      i;
    if (version === '10') {
      if (!isbn10Maybe.test(sanitized)) {
        return false;
      }
      for (i = 0; i < 9; i++) {
        checksum += (i + 1) * sanitized.charAt(i);
      }
      if (sanitized.charAt(9) === 'X') {
        checksum += 10 * 10;
      } else {
        checksum += 10 * sanitized.charAt(9);
      }
      if ((checksum % 11) === 0) {
        return !!sanitized;
      }
    } else if (version === '13') {
      if (!isbn13Maybe.test(sanitized)) {
        return false;
      }
      const factor = [1, 3];
      for (i = 0; i < 12; i++) {
        checksum += factor[i % 2] * sanitized.charAt(i);
      }
      if (sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
        return !!sanitized;
      }
    }
    return false;
  };

  validator.isJSON = function (str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  validator.isMultibyte = function (str) {
    return multibyte.test(str);
  };

  validator.isAscii = function (str) {
    return ascii.test(str);
  };

  validator.isFullWidth = function (str) {
    return fullWidth.test(str);
  };

  validator.isHalfWidth = function (str) {
    return halfWidth.test(str);
  };

  validator.isVariableWidth = function (str) {
    return fullWidth.test(str) && halfWidth.test(str);
  };

  validator.isSurrogatePair = function (str) {
    return surrogatePair.test(str);
  };

  validator.isBase64 = function (str) {
    return base64.test(str);
  };

  validator.ltrim = function (str, chars) {
    const pattern = chars ? new RegExp(`^[${chars}]+`, 'g') : /^\s+/g;
    return str.replace(pattern, '');
  };

  validator.rtrim = function (str, chars) {
    const pattern = chars ? new RegExp(`[${chars}]+$`, 'g') : /\s+$/g;
    return str.replace(pattern, '');
  };

  validator.trim = function (str, chars) {
    const pattern = chars ? new RegExp(`^[${chars}]+|[${chars}]+$`, 'g') : /^\s+|\s+$/g;
    return str.replace(pattern, '');
  };

  validator.escape = function (str) {
    return (str.replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;'));
  };

  validator.stripLow = function (str, keep_new_lines) {
    const chars = keep_new_lines ? '\x00-\x09\x0B\x0C\x0E-\x1F\x7F' : '\x00-\x1F\x7F';
    return validator.blacklist(str, chars);
  };

  validator.whitelist = function (str, chars) {
    return str.replace(new RegExp(`[^${chars}]+`, 'g'), '');
  };

  validator.blacklist = function (str, chars) {
    return str.replace(new RegExp(`[${chars}]+`, 'g'), '');
  };

  function merge(obj, defaults) {
    obj = obj || {};
    for (const key in defaults) {
      if (typeof obj[key] === 'undefined') {
        obj[key] = defaults[key];
      }
    }
    return obj;
  }

  validator.init();

  return validator;
}));
