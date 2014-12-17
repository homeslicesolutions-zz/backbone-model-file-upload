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

    if (_.isEmpty(files)) return res.end(JSON.stringify(output));

    for (var i in files) {
      if (files.hasOwnProperty(i)) {

        output[i] = {};

        fs.readFile(files[i].path, function (err, data) {

          output[i].type = files[i].type;
          output[i].size = files[i].size;
          output[i].name = files[i].name;
          output[i].lastModifiedDate = files[i].lastModifiedDate;
          output[i].data = 'data:' + files[i].type + ';base64,' + data.toString('base64');

          res.end(JSON.stringify(output));

        });

      }
    }

  });

});

var unflatten = function(path, obj, value) {
  var key, child, output;
  if (Object.prototype.toString.call(path) == '[object Object]') {
    output = {};
    for (key in path) {
      if (path.hasOwnProperty(key)) {
        unflatten(key.split('.'), output, path[key]);
      }
    }
    return output;
  }
  key = path.shift();

  if (!path.length) {
    obj[key] = value;
    return obj;
  }

  if ((child = obj[key]) == void 0) {
    child = obj[key] = {};
  }

  unflatten(path, child, value);

  return obj;
};

server.listen(options.port, options.host);
console.log("listening on " + options.host + ':' + options.port);
