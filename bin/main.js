#!/usr/bin/env node
var concat = require('concat-stream');
var fs     = require('fs');
var parse  = require('../');

if (process.argv[2]) {
  fs.createReadStream(process.argv[2]).pipe(concat(function (data) {
    print(data.toString());
  }));
} else {
  process.stdin.pipe(concat(function (data) {
    print(data.toString());
  }));
}

function print(data) {
  var obj = parse(data);
  console.log(JSON.stringify(obj, null, '  '));
}
