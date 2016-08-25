/**
 * Created by David Yahalomi on 25/08/2016.
 */
var fs = require('fs');
var babel = require('babel-core');
var optionalPlugin = require('./optional');

var filename = process.argv[2];

fs.readFile(filename, function(err, data) {
  if(err) throw err;
  
  var src = data.toString();
  
  var out = babel.transform(src, {
    plugins: [optionalPlugin]
  });
  
  console.log(out.code);
});
