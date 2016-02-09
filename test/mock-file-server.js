'use strict';

var http = require('http'),
    formidable = require('formidable'),
    fs = require('fs'),
    _ = require('lodash');


var options = {
  host: 'localhost',
  port: 8989
};

var server = http.createServer(function(req,res) {

  console.log('POST Detected with incoming Form-data...');

  var form = new formidable.IncomingForm(),
      files = {},
      fields = {};

  form.on('file', function(field, file) {
    files[field] = (files[field] || []).concat([file]);
  });
  form.on('field', function(field, value) {
    fields[field] = value;
  });
  form.on('end',  function(err) {
    console.log('POST Finished and publishing object back to browser...');

    var headers = {};
    headers['Content-Type'] = 'application/json';
    headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Access-Control-Allow-Origin, Content-Type, Accept";

    res.writeHead(200, headers);

    var output = {};

    _.extend(output, unflatten(fields));
    var fileOutputs = {};
    _.each(files, function(files, filename){
      var loopOutputs = [];
      _.each(files, function(file) {
        var fileOutput = {},
            data = fs.readFileSync(file.path);
        fileOutput.type = file.type;
        fileOutput.size = data.length;
        fileOutput.name = file.name;
        fileOutput.lastModifiedDate = file.lastModifiedDate;
        fileOutput.data = 'data:' + file.type + ';base64,' + data.toString('base64');
        loopOutputs.push(fileOutput);
      });
      loopOutputs = loopOutputs.length > 1 ? loopOutputs : loopOutputs[0];
      fileOutputs[filename] = loopOutputs;
    });
    output = _.merge(output, fileOutputs);

    console.info(output);

    res.end(JSON.stringify(output));

  });

  form.parse(req)

});

function unflatten(obj, output) {
  var re = /^([^\[\]]+)\[(.+)\]$/g;
  output = output || {};
  for (var key in obj) {
    var value = obj[key];
    if (!key.toString().match(re)) {
      var tempOut = {};
      tempOut[key] = value;
      _.extend(output, tempOut);
    } else {
      var keys = _.compact(key.split(re)), tempOut = {};
      tempOut[keys[1]] = value;
      output[keys[0]] = unflatten( tempOut, output[keys[0]] )
    }
  }
  return output;
}

server.listen(options.port, options.host);
console.log("listening on " + options.host + ':' + options.port);
