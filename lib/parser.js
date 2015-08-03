'use strict';

var esprima = require('esprima');

module.exports = {
  /**
   * @method parse
   * @param {string} data
   */
  parse: function (data) {
    var result   = {};
    var comments = esprima.parse(data, { comment: true }).comments;
    var idx      = 0;

    comments.forEach(function (comment) {
      this.parseComment(comment.value).forEach(function (a) {
        if (!result[a.name]) {
          result[a.name] = [];
        }

        result[a.name].push({
          idx: idx,
          val: a.args
        });

        idx = idx + 1;
      }, this);
    }, this);

    return result;
  },

  /**
   * Parse a comment for annotations
   * @param {string} comment - comment string
   */
  parseComment: function (comment) {
    var lines = comment.split('\n');

    return lines
      .map(this.sanitizeLine)
      .filter(this.notFalsey)
      .map(this.lineToObject.bind(this))
      .filter(this.notFalsey);
  },

  /**
   * Convert an annotation line to an object
   * @param {string} line
   * @return {object}
   */
  lineToObject: function (line) {
    var regex      = /^@(vx-)?([\w|-]*)(.*)*/i;
    var match      = line.match(regex);
    var annotation;
    var args;

    if (!match || !match[2] /* annotation */) {
      return null;
    }

    annotation = match[2];
    args       = match[3] || [];

    if (typeof args === 'string') {
      args = args
        .split(' ')
        .map(this.trim)
        .filter(this.notFalsey);
    }

    return {
      name: this.camel(annotation),
      args: args
    };
  },

  /**
   * Trim white space
   * @param {string} str
   * @return {string}
   */
  trim: function (str) {
    return str.trim();
  },

  /**
   * Sanitize comment line by stripping the following characters:
   *    *  ,  [  ]  (  )
   * @param {string} line
   * @return {string} sanitized string
   */
  sanitizeLine: function (line) {
    return line
      .trim()
      .replace(/^\s*\**\s*/, '')
      .trim()
      .replace(/[\[|\]|\)|\(|,]/g, '');
  },

  /**
   * Not empty - return true if value is not falsey
   * @param {object} value
   * @return {boolean}
   */
  notFalsey: function (value) {
    return Boolean(value);
  },

  /**
   * Camel case a string
   * @param {string} input
   * @returns {string} camel cased string
   */
  camel: function (input) {
    return input.replace(/-(.)/g, function (match) {
      return match[1].toUpperCase();
    });
  }
};
