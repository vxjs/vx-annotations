var annotations = hmt.lib('parser');
var assert      = require('assert');

describe('annotations', function () {
  describe('parse', function () {
    var input, output;

    before(function () {
      input  = hmt.fixture('hello.spec.js');
      output = annotations.parse(input);
    });

    it('should return args', function () {
      assert.deepEqual(output.code[0], ['../foo.js', 'coffee-script', 'sweet']);
      assert.deepEqual(output.code[1], ['../bar.js']);
    });

    it('should parse vx-* prefixed', function () {
      assert.deepEqual(output.includeCode[0], ['absolute.js']);
    });

  });

  describe('parseComment', function () {
    it('handles block comments', function () {
      var input  = '* @vx-code foobar.js \n* @code-include foo biz, bar';
      var output = annotations.parseComment(input);

      assert.deepEqual(output, [
        { name: 'code', args: ['foobar.js'] },
        { name: 'codeInclude', args: ['foo', 'biz', 'bar'] }
      ]);
    });
  });

  describe('sanitizeLine', function () {
    it('strip all desired characters *-', function () {
      var input = ' ** hello, mr. foobar (thinker, b) [*hello, g]';
      var expected = 'hello mr. foobar thinker b *hello g';
      var output = annotations.sanitizeLine(input);

      assert.equal(output, expected);
    });
  });

  describe('lineToObject', function () {
    it('should work with a simple annotation', function () {
      var line = '@vx-code-file foo.js';
      var obj  = annotations.lineToObject(line);

      assert.deepEqual(obj, {
        name: 'codeFile',
        args: ['foo.js']
      });
    });

    it('should work with a complex annotation', function () {
      var line = '@includes foo.js coffee-script  foobar ';
      var obj  = annotations.lineToObject(line);

      assert.deepEqual(obj, {
        name: 'includes',
        args: ['foo.js', 'coffee-script', 'foobar']
      });
    });

    it('should work with an annotation without args', function () {
      var line = '@vbaby';
      var obj  = annotations.lineToObject(line);

      assert.deepEqual(obj, {
        name: 'vbaby',
        args: []
      });
    });

    it('should work with a normal comment line', function () {
      var line = 'includes foo.js coffee-script  foobar ';
      var obj  = annotations.lineToObject(line);

      assert.deepEqual(obj, null);
    });
  });

  describe('camel', function () {
    it('should work on non-hyphenated string', function () {
      assert.equal('includeGroup', annotations.camel('includeGroup'));
    });

    it('should work on multi-hyphenated string', function () {
      assert.equal('includeGroupFun', annotations.camel('include-group-fun'));
    });
  });
});
