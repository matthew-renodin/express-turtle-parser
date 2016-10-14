/**
 * Module dependencies.
 */
var turtle2js = require('n3'),
    http = require('http'),
    regexp = /^(text\/turtle|application\/([\w!#\$%&\*`\-\.\^~]+\+)?turtle)$/i;

/**
 * Module exports.
 */
module.exports = turtleparser;
module.exports.regexp = regexp;

/**
 * Expose configuration for turtle-bodyparser middleware
 *
 * @api public
 * @param {Object} options Parser options
 * @return {turtlebodyparser}
 */
function turtleparser(options) {

  /**
   * Provide connect/express-style middleware
   *
   * @param {IncomingMessage} req
   * @param {ServerResponse} res
   * @param {Function} next
   * @return {*}
   */
  function turtlebodyparser(req, res, next) {
    var data = '',
        parser = new turtle2js.Parser(),

        /**
         * @param {Error} err
         * @param {Object} triple
         * @param {Object} prefixes
         */
        responseHandler = function (err, triple, prefixes) {
          if (err) {
            err.status = 400;
            return next(err);
          }

          if (triple) {
            if (!req.triples) {
              req.triples = [];
            }
            req.triples.push(triple);
          }
          else {
            req.rawBody = data;
            next();
          }
        };

    if (req._body) {
      return next();
    }

    req.body = req.body || {};

    if (!hasBody(req) || !module.exports.regexp.test(mime(req))) {
      return next();
    }

    req._body = true;

    // explicitly cast incoming to string
    req.setEncoding('utf-8');
    req.on('data', function (chunk) {
      data += chunk;
    });

    req.on('end', function () {
      // invalid turtle, length required
      if (data.trim().length === 0) {
        return next(error(411));
      }
      // responseHandler(null, data, {});
      parser.parse(data, responseHandler);
    });
  }

  return turtlebodyparser;
}

/**
 * Test whether request has body
 *
 * @see connect.utils
 * @param {IncomingMessage} req
 * @return boolean
 */
function hasBody(req) {
  var encoding = 'transfer-encoding' in req.headers,
      length = 'content-length' in req.headers && req.headers['content-length'] !== '0';
  return encoding || length;
}

/**
 * Get request mime-type without character encoding
 *
 * @see connect.utils
 * @param {IncomingMessage} req
 * @return string
 */
function mime(req) {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
}

/**
 * Factory for new Error with statuscode
 *
 * @see connect.utils
 * @param {number} code
 * @param {*} msg
 * @return {Error}
 */
function error(code, msg) {
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  return err;
}

