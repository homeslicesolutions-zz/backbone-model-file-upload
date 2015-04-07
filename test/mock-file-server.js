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

  var form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {
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

    if (!_.isEmpty(files)) {

      for (var i in files) {
        if (files.hasOwnProperty(i)) {

          output[i] = {};

          fs.readFile(files[i].path, function (err, data) {

            output[i].type = files[i].type;
            output[i].size = files[i].size;
            output[i].name = files[i].name;
            output[i].lastModifiedDate = files[i].lastModifiedDate;
            output[i].data = 'data:' + files[i].type + ';base64,' + data.toString('base64');

          });

        }
      }

    }

    console.info(output);

    res.end(JSON.stringify(output));

  });

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
